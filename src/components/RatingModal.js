import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "./RatingModal.css";

const RatingModal = ({ movieId, user, title }) => {
  const [rating, setRating] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    if (!user) return;

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

  const handleSaveRating = async () => {
    if (!user) {
      alert("Musíš se přihlásit, abys mohl/a hodnotit.");
      return;
    }

    if (hasRated) {
      alert("Už jsi tento film ohodnotil/a.");
      return;
    }

    try {
      await projectFirestore
        .collection("movies")
        .doc(movieId)
        .collection("ratings")
        .doc(user.uid)
        .set({ rating: selectedRating });

      setRating(selectedRating);
      setHasRated(true);
      setIsOpen(false);
      alert("Hodnocení uloženo!");
    } catch (error) {
      console.error("Chyba při ukládání hodnocení:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Zakáže scroll
    } else {
      document.body.style.overflow = "auto"; // Povolit scroll po zavření
    }
    
    return () => {
      document.body.style.overflow = "auto"; // Reset při unmountu
    };
  }, [isOpen]);
  

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="btn">
        <FaRegStar />
      </button>

      {isOpen && (
        <div className="modal-overlay">
            <div className="modal-window">
              <button onClick={() => setIsOpen(false)} className="close-button">
                <IoMdClose />
              </button>
                <h2>Hodnocení:</h2>
                <h2>"{title}"</h2>
            <div className="stars">
              {[...Array(10)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    color={
                      starValue <= (hoverRating || selectedRating || rating)
                        ? "#ffc107"
                        : "#8a8a8a"
                    }
                    onClick={() => setSelectedRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                );
              })}
            </div>

            <button onClick={handleSaveRating} className="rate-button">
              Ohodnotit
            </button>
        </div>
        </div>
        
      )}
    </div>
  );
};

export default RatingModal;
