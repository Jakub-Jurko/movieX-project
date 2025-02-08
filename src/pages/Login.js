import { useState } from "react";
import { projectAuth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./Login.css"

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
          className="background"
          style={{
            backgroundImage: `url(./images/background.jpg)`,
          }}
        ></div>
      <h2>Přihlášení</h2>
      <button onClick={handleGoogleLogin}>Přihlásit se přes Google</button>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin} className="email-login">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Přihlásit se</button>
      </form>
    </div>
  );
};

export default Login;
