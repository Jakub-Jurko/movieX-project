import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import { projectFirestore } from "../firebase/config";
import "./Carousel.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carousel = ({ collectionName }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = projectFirestore.collection(collectionName).onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          setError(`Žádná data v kolekci "${collectionName}"`);
          setData([]);
        } else {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
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
  }, [collectionName]);

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return <FaChevronLeft className="custom-arrow custom-prev" onClick={onClick} />;
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return <FaChevronRight className="custom-arrow custom-next" onClick={onClick} />;
  };

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    dots: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="carousel-container">
      {error && <p>{error}</p>}
      
      <Slider {...settings}>
        {data.map((item) => {
          const { id, large_img_url, title } = item;
          return (
            <div key={id} className="carousel-slide">
              <NavLink to={`/${collectionName === "serials" ? "one-serial" : "one-movie"}/${id}`}>
                <img src={large_img_url} alt={title} className="carousel-image" />
                <h1 className="carousel-title">{title}</h1>
              </NavLink>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
