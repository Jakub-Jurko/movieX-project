import styles from "./AllSerials.module.css"; 
import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { NavLink } from "react-router-dom";
import Carousel from "../../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PercentageDisplay from "../../components/PercentageDisplay";
import { GridLoader } from "react-spinners";

const AllSerials = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
      <div className="grid-loader">
        <GridLoader color="#727D73" size={30} />
      </div>
    );
  }

  return (
    <div>
      <Carousel collectionName="serials" /> {/* Předáváme parametry pro správnou kolekci */}
      {error && <p>{error}</p>}
      <div className={styles["all-movies"]}>
        {data.map((oneSerial) => {
          const { id, title, small_img_url } = oneSerial;

          return (
            <div className={styles["one-serial"]} key={id}>
              <NavLink to={`/one-serial/${id}`}>
                <img className={styles["serial-img"]} src={small_img_url} alt={title} />
                <p className={styles.percenta}>
                  <PercentageDisplay collectionName="serials" contentId={id} />
                </p>
                <h4>{title}</h4>
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllSerials;
