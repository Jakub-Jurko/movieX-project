import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { projectFirestore } from "../firebase/config";
import "./Ratings.css"

const Ratings = ({ movieId }) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("movies")
      .doc(movieId)
      .collection("ratings")
      .onSnapshot((snapshot) => {
        let total = 0;
        let count = 0;

        snapshot.forEach((doc) => {
          total += doc.data().rating;
          count++;
        });

        setAverageRating(count > 0 ? (total / count).toFixed(1) : 0);
      });

    return () => unsubscribe(); // Odhlášení listeneru při odchodu ze stránky
  }, [movieId]);

  return (
    <div className="ratings-container">
      <FaStar className="fa-star" />
      <span>{averageRating}</span>
    </div>
  );
};

export default Ratings;
