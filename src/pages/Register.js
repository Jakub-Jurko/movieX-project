import { useState, useEffect } from "react";
import { projectAuth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import backgroundImage from "../images/background-moviex.jpg";
import { BsGoogle } from "react-icons/bs";
import { GridLoader } from "react-spinners"; // Importujeme GridLoader

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Stav pro kontrolu načítání
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulace načítání pozadí nebo dat (např. po načtení obrázků, apod.)
    const loadData = () => {
      // Simulace čekání na načtení
      setTimeout(() => {
        setLoading(false); // Když je vše načteno, nastavíme loading na false
      }, 2000); // Nastavení 2 sekundy pro simulaci načítání (nahraďte skutečným procesem)
    };

    loadData();
  }, []); // Spustí se při načtení komponenty

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Začátek načítání
    try {
      await projectAuth.createUserWithEmailAndPassword(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Konec načítání
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true); // Začátek načítání
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      await projectAuth.signInWithPopup(googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Konec načítání
    }
  };

  return (
    <div className="register-page">
      {/* Spinner se zobrazuje, když je loading true */}
      {loading ? (
        <div className="grid-loader">
        <GridLoader color='#727D73' size={30}/>
    </div>
      ) : (
        <>
          <div
            className="background-register"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          ></div>
          <div className="register-form">
            <h2>Registrace</h2>
            {error && <p>{error}</p>}
            <form className="email-register" onSubmit={handleRegister}>
              <input
                className="input-register"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="input-register"
                type="password"
                placeholder="Heslo"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Registrovat se</button>
            </form>
            <p className="divider-text">nebo</p>
            <button className="google-register" onClick={handleGoogleRegister}>
              <BsGoogle />
              Registrovat se přes Google
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
