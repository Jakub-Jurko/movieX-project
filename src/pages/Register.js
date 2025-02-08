import { useState } from "react";
import { projectAuth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <h2>Registrace</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Heslo" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Registrovat se</button>
      </form>
    </div>
  );
};

export default Register;
