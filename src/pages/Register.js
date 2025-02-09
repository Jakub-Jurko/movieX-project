import { useState } from "react";
import { projectAuth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import backgroundImage from "../images/background-moviex.jpg";
import { BsGoogle } from "react-icons/bs";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await projectAuth.createUserWithEmailAndPassword(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" })
      await projectAuth.signInWithPopup(googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
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
    </div>
  );
};

export default Register;
