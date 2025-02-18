import "./Home.css"
import welcomeImage from "../images/welcome-images.jpg";

const Home = () => {
    return <div>
        <img className="welcome-img" src={welcomeImage} alt="" />
    </div>        
    
};

export default Home;