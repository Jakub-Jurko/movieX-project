import "./Footer.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <p>Ukázkový projekt vytvořený v Reactu</p>
        <p>&copy; {new Date().getFullYear()} Jurko Jakub</p>

        <div className="footer-links">
          <a href="https://github.com/Jakub-Jurko" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/jakub-jurko-331683285/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
