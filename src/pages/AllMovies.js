import "./AllMovies.css"
import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";
import { FaStar } from "react-icons/fa6";
import { NavLink } from 'react-router-dom'

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

    return <div className="all-movies">
        {error && <p>{error}</p>}
        {data.map( (oneMovie) => {
            const {id, title, small_img_url, evaluatedi} = oneMovie

            return (
                <NavLink key={id} to={`/one-movie/${id}`} className="one-movie">
                    <img src={small_img_url} alt="" />
                    <p className="evaluatedi"><FaStar className="star"/> {evaluatedi}</p>
                    <p className="title">{title}</p>
                </NavLink>
            )
        })}
    </div>
};

export default Allmovies;