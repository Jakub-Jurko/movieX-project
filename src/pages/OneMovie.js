import "./OneMovie.css"
import { useParams } from "react-router-dom";
import { projectFirestore } from "../firebase/config";
import { useState, useEffect } from "react";
import Trailer from './Trailer'

const OneMovie = () => {
    const [data, setData] = useState({})
    const [error, setError] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 200;

    const { movieId } = useParams()
    
    useEffect( () => {
        projectFirestore.collection("movies").doc(movieId).get().then( (document) => {

            if (document.exists) {
                setData(document.data())                
            } else {
                setError("Nenašli jsme tento film")
            }
            
        }).catch( (err) => {
            setError(err.message)
        })
    }, [movieId])   
    
    const shortText =
        data.description && data.description.length > maxLength
        ? data.description.slice(0, maxLength) + "..."
        : data.description

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
              <h1>{data.title}</h1>
              <p className="info">{data.year} • {data.min_age}+ • {data.time} min</p>
              <div className="genres">
                {data.genres && data.genres.map((genre, id) => (
                  <p key={id} className="genre">{genre}</p>
                ))}
              </div>
            </div>
          </div>
          <p className="description">
            {isExpanded ? data.description : shortText}{" "}
            {data.description && data.description.length > maxLength && (
              <span onClick={() => setIsExpanded(!isExpanded)}>
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