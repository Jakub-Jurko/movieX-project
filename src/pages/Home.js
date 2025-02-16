import { GridLoader } from 'react-spinners'
import "./Home.css"

const Home = () => {
    return (
        <div className="grid-loader">
            <GridLoader color='#727D73' size={30}/>
        </div>
    );
};

export default Home;