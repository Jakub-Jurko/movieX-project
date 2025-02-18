import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RatingModal.css";
import { motion } from "framer-motion"

const RatingModal = ({ id, user, title, collectionName }) => {
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
          .collection(collectionName)
          .doc(id)
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
  }, [ id, user, collectionName ]);

  const handleSaveRating = async () => {
    if (!user) {
      toast.error("Musíš se přihlásit, abys mohl/a hodnotit.", {
        position: "top-center",
        className: "alert",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        icon: false,
        theme: "dark",
        closeButton: false,
      });
      return;
    }

    if (hasRated) {
      toast.info("Už jsi tento film hodnotil/a.", {
        position: "top-center",
        className: "alert",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        icon: false,
        theme: "dark",
        closeButton: false,
      });
      return;
    }

    try {
      await projectFirestore
        .collection(collectionName)
        .doc(id)
        .collection("ratings")
        .doc(user.uid)
        .set({ rating: selectedRating });

      setRating(selectedRating);
      setHasRated(true);
      setIsOpen(false);
      
      toast.success("Hodnocení uloženo!", {
        position: "top-center",
        className: "alert",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        icon: false,
        theme: "dark",
        closeButton: false,
      });

    } catch (error) {
      console.error("Chyba při ukládání hodnocení:", error);
      toast.error("Chyba při ukládání hodnocení!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedRating(rating || 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, rating]);

  const bounceAnimation = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.4, 1], transition: { duration: 0.3 } },
  };

  return (
    <div>
      {/* ToastContainer musí být v JSX */}
      <ToastContainer />

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
                  <motion.div
  key={index}
  initial="initial"
  animate={
    // Animuj pouze ty hvězdy, které jsou vybrané
    starValue <= selectedRating
      ? { scale: [1, 1.4, 1], transition: { duration: 0.3, delay: index * 0.05 } }
      : "initial"
  }
>
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
                  /></motion.div>
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

