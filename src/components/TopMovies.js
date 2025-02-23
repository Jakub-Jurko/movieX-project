import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./TopMovies.module.css";
import PercentageDisplay from "./PercentageDisplay";
import { NavLink } from "react-router-dom";
import { projectFirestore } from "../firebase/config";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FadeLoader } from 'react-spinners';

const TopMovies = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchMovies = async () => {
      try {
        const moviesSnapshot = await projectFirestore.collection("movies").get();
        let movieData = [];

        for (const doc of moviesSnapshot.docs) {
          const movie = { id: doc.id, ...doc.data() };

          // Získání hodnocení z podkolekce "ratings"
          const ratingsSnapshot = await projectFirestore
            .collection("movies")
            .doc(movie.id)
            .collection("ratings")
            .get();

          let ratings = [];
          ratingsSnapshot.docs.forEach((ratingDoc) => {
            ratings.push(ratingDoc.data().rating);
          });

          if (ratings.length > 0) {
            movie.avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          } else {
            movie.avgRating = 0;
          }

          movieData.push(movie);
        }

        // Seřadit podle hodnocení
        movieData.sort((a, b) => b.avgRating - a.avgRating);

        // Vybrat top 10
        setData(movieData.slice(0, 10));
      } catch (err) {
        setError("Chyba při načítání filmů");
      } finally {
        setLoading(false)
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className={styles.fadeLoader}>
        <FadeLoader color="#5e5e5e"/>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  const PrevArrow = (props) => {
    const { onClick } = props;
    return <IoIosArrowBack className={`${styles.customPrevArrow} ${styles.customArrows}`} onClick={onClick} />;
  };
  
  const NextArrow = (props) => {
    const { onClick } = props;
    return <IoIosArrowForward className={`${styles.customNextArrow} ${styles.customArrows}`} onClick={onClick} />;
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 2,
    swipeToSlide: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2.5, slidesToScroll: 1, arrows: false },
      },
    ],
  };  

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {error && <p>{error}</p>}
        {data.map((oneMovie) => {
          const { id, title, small_img_url } = oneMovie;

          return (
            <div className={styles.oneMovie} key={id}>
              <NavLink to={`/one-movie/${id}`}>
                <img className={styles.movieImg} src={small_img_url} alt={title} />
                <div className={styles.percenta}>
                  <PercentageDisplay collectionName="movies" contentId={id} />
                </div>
                <h4 className={styles.title}>{title}</h4>
              </NavLink>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default TopMovies;
