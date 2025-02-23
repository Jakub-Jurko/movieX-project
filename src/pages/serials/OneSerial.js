import "./OneSerial.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../../firebase/config";
import Ratings from "../../components/Ratings";
import Trailer from "../trailers/Trailer";
import RatingModal from "../../components/RatingModal";
import { FadeLoader } from "react-spinners";

const OneSerial = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = projectAuth.currentUser;
  const { serialId } = useParams();
  const maxLength = 200;
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectFirestore
      .collection("serials")
      .doc(serialId)
      .get()
      .then((document) => {
        if (document.exists) {
          setData(document.data());
          setLoading(false)
        } else {
          setError("Nenašli jsme tento seriál");
          setLoading(false)
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false)
      });
  }, [serialId]);

  const shortText =
    data.description && data.description.length > maxLength
      ? data.description.slice(0, maxLength) + "..."
      : data.description;

      if (loading) {
        return (
          <div className="fade-loader">
            <FadeLoader color="#5e5e5e"/>
          </div>
        );
      }

  return (
    <section className="one-serial-section">
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
            {data.year} • {data.min_age}+ • <span className="actor-list">
              {data.country &&
                data.country.map((state, id) => (
                  <span key={id}>
                    {state}
                    {id < data.country.length - 1 ? " • " : ""}
                  </span>
                ))}
            </span>
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
            <Ratings id={serialId} collectionName={"serials"} />
            <RatingModal id={serialId} collectionName={"serials"} user={user} title={data.title} />
          </div>
        </div>
      </div>      

      <div className="people-box">
        <img src={data.small_img_url} alt="" className="small-img" />
        <div className="all-people">
        <p className="creative">
            <span className="role">Tvůrci </span>
            <span>
              {data.creative &&
                data.creative.map((creator, id) => (
                  <span key={id} className="person">
                    {creator}
                    {id < data.creative.length - 1 ? " • " : "..."}                    
                  </span>                  
                ))}
            </span>
          </p>
          <p className="people">
            <span className="role">Réžie </span>
            <span>
              {data.director &&
                data.director.map((director, id) => (
                  <span key={id} className="person">
                    {director}
                    {id < data.scenario.length - 1 ? " • " : ""}                    
                  </span>                  
                ))}
            </span>
          </p>
          <p className="people">
            <span className="role">Scénař </span>
            <span>
              {data.scenario &&
                data.scenario.map((scenarist, id) => (
                  <span key={id} className="person">
                    {scenarist}
                    {id < data.scenario.length - 1 ? " • " : "..."}                    
                  </span>                  
                ))}
            </span>
          </p>
          <p className="people">
            <span className="role">Hrají </span>
            <span>
              {data.actors &&
                data.actors.map((actor, id) => (
                  <span key={id} className="person">
                    {actor}
                    {id < data.actors.length - 1 ? " • " : "..."}                    
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

export default OneSerial;
