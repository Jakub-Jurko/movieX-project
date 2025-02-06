import { useState, useEffect } from "react";
import Slider from "react-slick";
import { projectFirestore } from "../firebase/config";
import "./Carousel.css";

const Carousel = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect( () => {
    const unsubscribe = projectFirestore.collection("movies").onSnapshot( (snapshot) => {
        if (snapshot.empty){
            setError("Žádné filmy k zobrazení")
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

const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,  // Povolit šipky
    dots: false,   // Zakázat tečky
    prevArrow: <button className="slick-prev">&#10094;</button>,  // Vlastní šipky
    nextArrow: <button className="slick-next">&#10095;</button>,
  };
  

  return (
    <div className="carousel-container">
      {error && <p>{error}</p>}
      
      <Slider {...settings}>
        {data.map((oneMovie) => {
          const { id, large_img_url } = oneMovie;
          return (
            <div key={id} className="carousel-slide">
              <img 
                src={large_img_url} 
                alt="" 
                className="carousel-image" 
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
