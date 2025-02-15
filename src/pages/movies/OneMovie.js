import "./OneMovie.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../../firebase/config";
import Ratings from "../../components/Ratings"; // Importuj komponentu Rating
import Trailer from "../trailers/Trailer";
import RatingModal from "../../components/RatingModal";

const OneMovie = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = projectAuth.currentUser;
  const { movieId } = useParams();
  const maxLength = 200;
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    projectFirestore
      .collection("movies")
      .doc(movieId)
      .get()
      .then((document) => {
        if (document.exists) {
          setData(document.data());
        } else {
          setError("Nenašli jsme tento film");
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
          <img src={data.large_img_url} alt="mobile-img" className="mobile-img" />
          
          
          
          <div className="genres">
            {data.genres &&
              data.genres.map((genre, id) => (
                <p key={id} className="genre">
                  {genre}
                </p>
              ))}
          </div>
          <div className="ratings">
            <Ratings movieId={movieId} />
            <RatingModal movieId={movieId} user={user} title={data.title} />
          </div>
        </div>
      </div>

      <div className="people-box">
        <img src={data.small_img_url} alt="" className="small-img" />
        <div className="all-people">
          <p className="director">
            <span className="role">Réžie </span>
            <span className="person">{data.director}</span>
          </p>
          <p className="people">
            <span className="role">Scénař </span>
            <span className="person">{data.scenario}</span>
          </p>
          <p className="people">
            <span className="role">Hrají </span>
            <span className="actor-list">
              {data.actors &&
                data.actors.map((actor, id) => (
                  <span key={id} className="person">
                    {actor}
                    {id < data.actors.length - 1 ? " • " : ""}
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
