import { FaStar } from "react-icons/fa";
import { projectFirestore } from "../firebase/config";
import { useState, useEffect } from "react";

const Rating = ({ movieId, user, averageRating, setAverageRating }) => {
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false); // Nový state pro kontrolu, zda uživatel hodnotil

  useEffect(() => {
    // Při načítání komponenty zjistíme, zda už uživatel hodnotil
    if (user) {
      projectFirestore
        .collection("movies")
        .doc(movieId)
        .collection("ratings")
        .doc(user.uid) // Kontrola na základě UID uživatele
        .get()
        .then((doc) => {
          if (doc.exists) {
            setHasRated(true); // Pokud existuje dokument s hodnocením, uživatel už hodnotil
            setRating(doc.data().rating); // Nastavíme hodnocení, pokud uživatel hodnotil
          }
        })
        .catch((error) => console.error("Chyba při kontrole hodnocení: ", error));
    }
  }, [movieId, user]);

  const handleRating = (value) => {
    if (!user) {
      alert("Musíte být přihlášeni, abyste mohli hodnotit.");
      return;
    }

    if (hasRated) {
      alert("Už jste tento film ohodnotil/a.");
      return;
    }

    setRating(value);
    setHasRated(true); // Označíme, že uživatel ohodnotil film

    // Uložení hodnocení do Firestore
    projectFirestore
      .collection("movies")
      .doc(movieId)
      .collection("ratings")
      .doc(user.uid) // Použijeme UID uživatele jako klíč
      .set({ rating: value })
      .then(() => {
        alert("Hodnocení uloženo!");
      })
      .catch((error) => {
        console.error("Chyba při ukládání hodnocení:", error);
      });

    // Načítání průměrného hodnocení
    projectFirestore
      .collection("movies")
      .doc(movieId)
      .collection("ratings")
      .get()
      .then((snapshot) => {
        let total = 0;
        let count = 0;
        snapshot.forEach((doc) => {
          total += doc.data().rating;
          count++;
        });
        if (count > 0) {
          setAverageRating((total / count).toFixed(1)); // Aktualizace průměrného hodnocení
        } else {
          setAverageRating(0); // Pokud není žádné hodnocení
        }
      });
  };

  return (
    <div className="rating-container">
      {[...Array(10)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className="star"
            color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
            size={30}
            onClick={() => handleRating(starValue)}
            disabled={hasRated} // Pokud uživatel hodnotil, hvězdičky budou neaktivní
          />
        );
      })}
      
    </div>
  );
};

export default Rating;
