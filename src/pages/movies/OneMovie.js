import "./OneMovie.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../../firebase/config";
import Ratings from "../../components/Ratings"; // Importuj komponentu Rating
import Trailer from "../trailers/Trailer";
import RatingModal from "../../components/RatingModal";
import { GridLoader } from "react-spinners";

const OneMovie = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = projectAuth.currentUser;
  const { movieId } = useParams();
  const maxLength = 200;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectFirestore
      .collection("movies")
      .doc(movieId)
      .get()
      .then((document) => {
        if (document.exists) {
          setData(document.data());
          setLoading(false);
        } else {
          setError("Nenašli jsme tento film");
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [movieId]);

  const shortText =
    data.description && data.description.length > maxLength
      ? data.description.slice(0, maxLength) + "..."
      : data.description;

  return (
    <section className="one-movie-section">
      {error && <p>{error}</p>}
      {loading ? (
        <div className="grid-loader">
          <GridLoader color="#222222" size={30} />
        </div>
      ) : (
        <div className="page">
          <div
            className="background"
            style={{
              backgroundImage: `url(${data.large_img_url})`,
            }}
          ></div>

          <div className="content">
            <div className="title">
              <h1>{data.title}</h1>
              <p className="info">
                {data.year} • {data.min_age}+ • {data.time} min
              </p>
            </div>
            <img
              src={data.large_img_url}
              alt="mobile-img"
              className="mobile-img"
            />

            <div className="genres">
              {data.genres &&
                data.genres.map((genre, id) => (
                  <p key={id} className="genre">
                    {genre}
                  </p>
                ))}
            </div>
            <div className="ratings">
              <Ratings id={movieId} collectionName={"movies"} />
              <RatingModal
                id={movieId}
                collectionName={"movies"}
                user={user}
                title={data.title}
              />
            </div>
          </div>
        </div>
      )}

      <div className="people-box">
        <img src={data.small_img_url} alt="" className="small-img" />
        <div className="all-people">
          <p className="director">
            <span className="role">Réžie </span>
            <span className="actor-list">
              {data.director &&
                data.director.map((director, id) => (
                  <span key={id} className="person">
                    {director}
                    {data.director.length > 1 && id < data.director.length - 1
                      ? " • "
                      : ""}
                  </span>
                ))}
            </span>
          </p>
          <p className="people">
            <span className="role">Scénař </span>
            <span className="actor-list">
              {data.scenario &&
                data.scenario.map((scenario, id) => (
                  <span key={id} className="person">
                    {scenario}
                    {data.scenario.length > 1 && id < data.scenario.length - 1
                      ? " • "
                      : ""}
                  </span>
                ))}
            </span>
          </p>
          <p className="people">
            <span className="role">Hrají </span>
            <span className="actor-list">
              {data.actors &&
                data.actors.map((actor, id) => (
                  <span key={id} className="person">
                    {actor}
                    {id < data.actors.length - 1 ? " • " : "..."}
                  </span>
                ))}
            </span>
          </p>
          <p className="people">
            <span className="role">Země </span>
            <span className="actor-list">
              {data.country &&
                data.country.map((state, id) => (
                  <span key={id} className="person">
                    {state}
                    {id < data.country.length - 1 ? " • " : ""}
                  </span>
                ))}
            </span>
          </p>
        </div>
      </div>

      <p className="description">
        {isExpanded ? data.description : shortText}{" "}
        {data.description && data.description.length > maxLength && (
          <span className="desc" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? " méně" : " více"}
          </span>
        )}
      </p>
      <div className="trailer">
        <Trailer videoId={data.youtube_id} />
      </div>
    </section>
  );
};

export default OneMovie;
