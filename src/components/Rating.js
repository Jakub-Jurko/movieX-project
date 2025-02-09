import { FaStar } from "react-icons/fa";
import { projectFirestore } from "../firebase/config";
import { useState, useEffect } from "react";

const Rating = ({ movieId, user }) => {
  const [rating, setRating] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [hoverRating, setHoverRating] = useState(0); 

  useEffect(() => {
    if (!user) return;

    // Kontrola, zda už uživatel hodnotil
    const checkUserRating = async () => {
      try {
        const userRatingDoc = await projectFirestore
          .collection("movies")
          .doc(movieId)
          .collection("ratings")
          .doc(user.uid)
          .get();

        if (userRatingDoc.exists) {
          setRating(userRatingDoc.data().rating);
          setHasRated(true);
        }
      } catch (error) {
        console.error("Chyba při načítání hodnocení uživatele:", error);
      }
    };

    checkUserRating();
  }, [movieId, user]);

  const handleRating = async (value) => {
    if (!user) {
      alert("Musíte být přihlášeni, abyste mohli hodnotit.");
      return;
    }

    if (hasRated) {
      alert("Už jste tento film ohodnotil/a.");
      return;
    }

    setRating(value);
    setHasRated(true); 

    try {
      await projectFirestore
        .collection("movies")
        .doc(movieId)
        .collection("ratings")
        .doc(user.uid) 
        .set({ rating: value });

      alert("Hodnocení uloženo!");
    } catch (error) {
      console.error("Chyba při ukládání hodnocení:", error);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(10)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className="stars"
            color={
              starValue <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9"
            }
            size={30}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)} // Změní barvu při přejetí
            onMouseLeave={() => setHoverRating(0)} // Reset při opuštění
            style={{ cursor: "pointer" }} // Kurzorem ukážeme, zda lze kliknout
          />
        );
      })}
    </div>
  );
};

export default Rating;
