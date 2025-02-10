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
    <div className="movies-container">
      <Carousel />
      {error && <p>{error}</p>}
      <div className="all-movies">
      {data.map((oneMovie) => {
        const { id, title, small_img_url } = oneMovie;

        return (
          <div className="one-movie" key={id}>
            <NavLink to={`/one-movie/${id}`}>
              <img className="movie-img" src={small_img_url} alt="" />
              <p className="ratings"><Ratings movieId={id} width={60} fontSize={18}/></p>
              <h4>{title}</h4>
            </NavLink>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default Allmovies;
