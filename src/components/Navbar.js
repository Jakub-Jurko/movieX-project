import "./Navbar.css"
import { useState } from "react";
import logo from "../images/logo.png"
import { GiHamburgerMenu } from "react-icons/gi"
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <nav>
      <div className="navigation">
        <div className="nav-header">
          <img src={logo} alt="Logo" />
          <button onClick={() => setShowMenu(!showMenu)}>
            <GiHamburgerMenu className="hamburger-icon"/>
          </button>
        </div>

        <div className={`${showMenu ? "nav-list show" : "nav-list hide"}`}>
          <ul>
            <li><NavLink to="/" onClick={ () => setShowMenu(false)}>Domů</NavLink></li>
            <li><NavLink to="/all-movies" onClick={ () => setShowMenu(false)}>Filmy</NavLink></li>
            <li><NavLink to="/all-serials" onClick={ () => setShowMenu(false)}>Seriály</NavLink></li>
          </ul>
            
            
                   
        </div>
      </div>
    </nav>
    );
};

export default Navbar;