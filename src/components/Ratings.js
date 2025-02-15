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
  
        // Výpočet průměrného hodnocení
        let average = count > 0 ? (total / count).toFixed(1) : 0;
  
        // Přetypování average na string pro použití endsWith
        average = average.toString();
  
        // Pokud je průměr celé číslo (např. 5.0), odstraníme ".0"
        average = average.endsWith('.0') ? average.slice(0, -2) : average;
  
        // Pokud je hodnota průměrného hodnocení 0, zajistíme, že bude zobrazeno jako "0"
        if (average === "0") {
          average = "0";
        }
  
        // Nastavení průměrného hodnocení do stavu
        setAverageRating(average);
      });
  
    return () => unsubscribe();
  }, [movieId]);
  
  
  

  return (
    <div className="ratings-container">
      <FaStar className="fa-star" />
      <span>{averageRating}<span className="full-rating">/10</span></span>
    </div>
  );
};

export default Ratings;
