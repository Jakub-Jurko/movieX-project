import styles from "./AllMovies.module.css";
import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { NavLink } from "react-router-dom";
import Carousel from "../../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PercentageDisplay from "../../components/PercentageDisplay";
import { FadeLoader } from 'react-spinners';
import { FaSearch } from 'react-icons/fa';

const AllMovies = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");   
  const [searchVisible, setSearchVisible] = useState(false); 

  // Funkce pro vyčištění diakritiky a normalizaci textu
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Funkce pro filtrování filmů
  const filterMovies = (movies) => {
    if (!searchQuery) return movies; // Pokud není žádný dotaz, vracíme všechny filmy
    return movies.filter((movie) => {
      const movieTitle = removeDiacritics(movie.title.toLowerCase());
      const query = removeDiacritics(searchQuery.toLowerCase());
      return movieTitle.includes(query); // Kontrola, zda název filmu obsahuje dotaz
    });
  };

  // Načítání filmů z Firebase
  useEffect(() => {
    const unsubscribe = projectFirestore.collection("movies").onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setError("Žádné filmy k vypsání");
          setData([]);
        } else {
          let results = [];
          snapshot.docs.forEach((oneMovie) => {
            results.push({ id: oneMovie.id, ...oneMovie.data() });
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

  // Pokud se data načítají, ukážeme loader
  if (loading) {
    return (
      <div className={styles.fadeLoader}>
        <FadeLoader color="#5e5e5e" />
      </div>
    );
  }

  return (
    <div>
      <Carousel collectionName="movies" /> 
      {error && <p>{error}</p>}
      
      <div className={styles.searching}>
      <div className={styles.searchIcon} onClick={() => setSearchVisible(!searchVisible)}>
        <FaSearch size={24} />
      </div>

      {/* Formulář pro vyhledávání */}
      {searchVisible && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Hledat film..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      </div>
      

      <div className={styles["all-movies"]}>
        {filterMovies(data).map((oneMovie) => {
          const { id, title, small_img_url } = oneMovie;

          return (
            <div className={styles["one-movie"]} key={id}>
              <NavLink to={`/one-movie/${id}`}>
                <img className={styles["movie-img"]} src={small_img_url} alt={title} />
                <div className={styles.percenta}>
                  <PercentageDisplay collectionName="movies" contentId={id} />
                </div>
                <h4>{title}</h4>
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllMovies;
