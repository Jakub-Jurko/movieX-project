import "./AllMovies.css";
import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { NavLink } from "react-router-dom";
import Carousel from "../../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Ratings from "../../components/Ratings";

const Allmovies = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

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
      },
      (err) => {
        setError(err.message);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="all-movies">
      <Carousel />
      {error && <p>{error}</p>}
      {data.map((oneMovie) => {
        const { id, title, small_img_url } = oneMovie;

        return (
          <div className="movie-container" key={id}>
            <NavLink to={`/one-movie/${id}`} className="one-movie">
              <img src={small_img_url} alt="" className="img" />
              <Ratings movieId={id} />
              <p className="title">{title}</p>
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};

export default Allmovies;
