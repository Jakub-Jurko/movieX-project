import { projectFirestore } from "../firebase/config";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Home.css"
import TopMovies from "../components/TopMovies"
import TopSerials from "../components/TopSerials"
import { MdLiveTv } from "react-icons/md";
import { FiTv } from "react-icons/fi";
import { FadeLoader } from 'react-spinners';

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = projectFirestore.collection("movies").onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            setError(`Žádná data v kolekci "${"movies"}"`);
            setData([]);
            setLoading(false)
          } else {
            const movie = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .find((movie) => movie.id === "vGGg9vOgj5PyyhKTWGVO"); // Vybere film podle id

          if (movie) {
            setData(movie);
            setLoading(false)
          }else {
            setError("Film s tímto ID nebyl nalezen.");
            setData(null);
            setLoading(false)
          }
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

    if (error) return <div>{error}</div>; // Zobrazení chyby
    if (loading) {
      return (
        <div className="fade-loader">
          <FadeLoader color="#5e5e5e"/>
        </div>
      );
    }
  return (
    <div className="home-page">
        <div className="home-head">
          <div
            className="home-background"
            style={{
              backgroundImage: `url(${data.large_img_url})`,
            }}
          ></div>

          <div className="home-content">
            <div className="home-info">
              <h1 className="home-title">{data.title}</h1>
              <p>
              Blíží se premiéra filmu Superman: Legacy, režisér James Gunn odhaluje nové pohledy na svou vizi tohoto ikonického superhrdiny.
              </p>
              <NavLink to={`/one-movie/vGGg9vOgj5PyyhKTWGVO`}>
              <button className="button">Trailer</button>
              </NavLink>
              <h3>V kinech od 10. července 2025</h3>
            </div>
          </div>
        </div>
        <div className="top-title">
        <h1><MdLiveTv /> Top 10 filmy</h1>
        </div>
        <TopMovies />
        <div className="top-title">
          <h1><FiTv /> Top 10 seriály</h1>
        </div>
        <TopSerials />
        
        
        
    </div>
    
      );
    };

export default Home;
