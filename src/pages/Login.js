import { useState } from "react";
import { projectAuth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./Login.css"
import { BsGoogle } from "react-icons/bs";
import backgroundImage from "../images/background-moviex.jpg"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await projectAuth.signInWithEmailAndPassword(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await projectAuth.signInWithPopup(googleProvider);
      console.log("Přihlášený uživatel:", result.user);
    } catch (error) {
      console.error("Chyba při přihlášení přes Google:", error.message);
    }
  };

  return (
    <div className="login-page">
      <div
          className="background-login"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
        <div className="login-form">
        <h2>Přihlas se k movieX</h2>
      <button onClick={handleGoogleLogin}><span className="google-logo"><BsGoogle /></span>Použít účet Google</button>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin} className="email-login">
        <input className="input-login" type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
        <input className="input-login" type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Přihlásit se</button>
      </form>
    </div>
        </div>
      
  );
};

export default Login;
