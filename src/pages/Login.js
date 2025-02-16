import { useState, useEffect } from "react";
import { projectAuth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { BsGoogle } from "react-icons/bs";
import backgroundImage from "../images/background-moviex.jpg";
import { GridLoader } from "react-spinners"; // Importujeme GridLoader

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Stav pro kontrolu načítání
  const navigate = useNavigate();

  useEffect(() => {
    // Simulace načítání pozadí nebo jiných dat
    const loadData = () => {
      // Simulace čekání na načtení
      setTimeout(() => {
        setLoading(false); // Když je vše načteno, nastavíme loading na false
      }, 2000); // Simulace načítání trvá 2 sekundy
    };

    loadData();
  }, []); // Spustí se při načtení komponenty

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Začátek načítání
    try {
      await projectAuth.signInWithEmailAndPassword(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Konec načítání
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true); // Začátek načítání
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await projectAuth.signInWithPopup(googleProvider);
      console.log("Přihlášený uživatel:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Chyba při přihlášení přes Google:", error.message);
    } finally {
      setLoading(false); // Konec načítání
    }
  };

  return (
    <div className="login-page">
      {/* Spinner se zobrazuje, když je loading true */}
      {loading ? (
        <div className="grid-loader">
        <GridLoader color='#727D73' size={30}/>
    </div>
      ) : (
        <>
          <div
            className="background-login"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          ></div>
          <div className="login-form">
            <h2>Přihlas se k movieX</h2>
            <button onClick={handleGoogleLogin}>
              <span className="google-logo">
                <BsGoogle />
              </span>
              Použít účet Google
            </button>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin} className="email-login">
              <input
                className="input-login"
                type="email"
                placeholder="E-mail"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="input-login"
                type="password"
                placeholder="Heslo"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Přihlásit se</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
