import styles from "./AllSerials.module.css";
import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { NavLink } from "react-router-dom";
import Carousel from "../../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PercentageDisplay from "../../components/PercentageDisplay";
import { FadeLoader } from "react-spinners";
import { FaSearch } from "react-icons/fa";

const AllSerials = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

  // Funkce pro vyčištění diakritiky a normalizaci textu
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Funkce pro filtrování seriálů
  const filterSerials = (serials) => {
    if (!searchQuery) return serials; // Pokud není žádný dotaz, vracíme všechny filmy
    return serials.filter((serial) => {
      const serialTitle = removeDiacritics(serial.title.toLowerCase());
      const query = removeDiacritics(searchQuery.toLowerCase());
      return serialTitle.includes(query); // Kontrola, zda název seriálu obsahuje dotaz
    });
  };

  useEffect(() => {
    const unsubscribe = projectFirestore.collection("serials").onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setError("Žádné seriály k vypsání");
          setData([]);
        } else {
          let results = [];
          snapshot.docs.forEach((oneSerial) => {
            results.push({ id: oneSerial.id, ...oneSerial.data() });
          });
          setData(results);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.fadeLoader}>
        <FadeLoader color="#5e5e5e" />
      </div>
    );
  }

  // Filtrujeme seriály podle vyhledávacího dotazu
  const filteredData = filterSerials(data);

  return (
    <div>
      <Carousel collectionName="serials" /> {/* Předáváme parametry pro správnou kolekci */}
      {error && <p>{error}</p>}

      {/* Ikona pro otevření vyhledávacího pole */}
      <div className={styles.searching}>
        <div
          className={styles.searchIcon}
          onClick={() => setSearchVisible(!searchVisible)}
        >
          <FaSearch size={24} />
        </div>

        {/* Formulář pro vyhledávání */}
        {searchVisible && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Hledat seriál..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Zobrazení filtrovaných výsledků */}
      <div className={styles["all-serials"]}>
        {filteredData.length === 0 ? (
          <p>Žádné výsledky pro tento dotaz.</p>
        ) : (
          filteredData.map((oneSerial) => {
            const { id, title, small_img_url } = oneSerial;

            return (
              <div className={styles["one-serial"]} key={id}>
                <NavLink to={`/one-serial/${id}`}>
                  <img
                    className={styles["serial-img"]}
                    src={small_img_url}
                    alt={title}
                  />
                  <p className={styles.percenta}>
                    <PercentageDisplay collectionName="serials" contentId={id} />
                  </p>
                  <h4>{title}</h4>
                </NavLink>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllSerials;
