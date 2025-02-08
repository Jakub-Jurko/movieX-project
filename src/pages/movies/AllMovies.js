import "./AllMovies.css"
import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { FaStar } from "react-icons/fa6";
import { NavLink } from 'react-router-dom'
import Carousel from "../../components/Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 

const Allmovies = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(false)

    useEffect( () => {
        const unsubscribe = projectFirestore.collection("movies").onSnapshot( (snapshot) => {
            if (snapshot.empty){
                setError("Žádné filmy k vypsání")
                setData([])
            } else {
                let results = []
                snapshot.docs.forEach( (oneMovie) => {
                    results.push( {id: oneMovie.id, ...oneMovie.data()})
                })
                setData(results)
            }
        }, (err) => {setError(err.message)})
        return () => {unsubscribe()}
    }, [])

     // Obnova pozice scrollování, pokud existuje uložená hodnota
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition)); // Vrátí uživatele zpět na uloženou pozici
    }

    // Uložení pozice při opuštění stránky
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY);
    };

    window.addEventListener('beforeunload', saveScrollPosition);

    // Cleanup event listener, aby se předešlo memory leakům
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

    return <div className="all-movies">
        <Carousel />
        {error && <p>{error}</p>}
        {data.map( (oneMovie) => {
            const {id, title, small_img_url, evaluatedi} = oneMovie

            return <div className="movie-container">
                <NavLink key={id} to={`/one-movie/${id}`} className="one-movie">
                    <img src={small_img_url} alt="" className="img"/>
                    <p className="evaluatedi"><FaStar className="star"/> {evaluatedi}</p>
                    <p className="title">{title}</p>
                </NavLink>
            </div>
        })}
    </div>
};

export default Allmovies;