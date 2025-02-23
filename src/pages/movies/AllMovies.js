import styles from "./AllMovies.module.css";
import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { NavLink } from "react-router-dom";
import Carousel from "../../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PercentageDisplay from "../../components/PercentageDisplay";
import { FadeLoader } from 'react-spinners';

const AllMovies = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className={styles.fadeLoader}>
        <FadeLoader color="#5e5e5e"/>
      </div>
    );
  }

  return (
    <div>
      <Carousel collectionName="movies" /> {/* Předáváme parametry pro správnou kolekci */}
      {error && <p>{error}</p>}
      <div className={styles["all-movies"]}>
        {data.map((oneMovie) => {
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
