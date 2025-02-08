import "./Navbar.css";
import { useState, useContext } from "react";
import logo from "../images/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { projectAuth } from "../firebase/config";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, role } = useContext(AuthContext); // Získání přihlášeného uživatele

  const handleLogout = async () => {
    await projectAuth.signOut();
  };

  return (
    <nav>
      <div className="navigation">
        <div className="nav-header">
          <NavLink to="/">
            <img src={logo} alt="Logo" />
          </NavLink>
          <button onClick={() => setShowMenu(!showMenu)}>
            <GiHamburgerMenu className="hamburger-icon" />
          </button>
        </div>

        <div className={`${showMenu ? "nav-list show" : "nav-list hide"}`}>
          <ul>
            {role === "admin" && <li>
              <NavLink to="add-movie" onClick={() => setShowMenu(false)}>
                Přidání filmů
              </NavLink>
            </li>}
            <li>
              <NavLink to="/" onClick={() => setShowMenu(false)}>
                Domů
              </NavLink>
            </li>
            <li>
              <NavLink to="/all-movies" onClick={() => setShowMenu(false)}>
                Filmy
              </NavLink>
            </li>
            <li>
              <NavLink to="/all-serials" onClick={() => setShowMenu(false)}>
                Seriály
              </NavLink>
            </li>
            {/* Přihlašovací sekce */}
            {user ? (
              <>
                <li>
                  <span className="user-email">{user.email}</span>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Odhlásit
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/register" onClick={() => setShowMenu(false)} className="register">
                    Registrovat
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    onClick={() => setShowMenu(false)}
                    className="login"
                  >
                    Přihlásit se
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
