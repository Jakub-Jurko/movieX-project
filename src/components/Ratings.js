import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineStar } from "react-icons/hi";
import { projectFirestore } from "../firebase/config";
import "./Ratings.css";

const Ratings = ({ id, collectionName }) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection(collectionName)
      .doc(id)
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
  }, [collectionName, id]);

  // Výpočet procenta z průměrného hodnocení (0-10 na 0-100)
  const fillPercentage = (averageRating / 10) * 100;

  return (
    <div className="ratings-container">
      <div className="star-rating">
        {/* Prázdná hvězda jako rámeček */}
        <HiOutlineStar className="outline-star"/>
        
        {/* Vyplněná hvězda podle procenta */}
        <FaStar 
          className="fa-star" 
          style={{
            clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` // Změní vyplnění hvězdy
          }} 
        />
      </div>
      {/* Zobrazení procenta místo 0-10 */}
      <span className="percenta">{Math.round(fillPercentage)}%</span>
    </div>
  );
};

export default Ratings;