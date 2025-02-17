import "./AddMovie.css";
import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { projectFirestore } from "../../firebase/config";

const AddMovie = () => {
  const [Title, setTitle] = useState("");
  const [Age, setAge] = useState(null);
  const [Time, setTime] = useState(null);
  const [Description, setDescription] = useState("");
  const [YoutubeId, setYoutubeId] = useState("");
  const [Actors, setActors] = useState([]);
  const [Director, setDirector] = useState([]);
  const [Scenario, setScenario] = useState([]);
  const [SmallImgUrl, setSmallImgUrl] = useState("");
  const [LargeImgUrl, setLargeImgUrl] = useState("");
  const [Country, setCountry] = useState([]);
  const [Genres, setGenres] = useState([]);
  const [Year, setYear] = useState(null);
  const { role } = useContext(AuthContext);

  const handleActorsChange = (e) => {
    setActors(e.target.value.split(","));
  };

  const handleDirectorChange = (e) => {
    setDirector(e.target.value.split(","));
  };

  const handleScenarioChange = (e) => {
    setScenario(e.target.value.split(","));
  };

  const handleGenresChange = (e) => {
    setGenres(e.target.value.split(","));
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value.split(","));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const newMovie = {
      title: Title,
      min_age: parseInt(Age),
      time: parseInt(Time),
      description: Description,
      youtube_id: YoutubeId,
      director: Director,
      scenario: Scenario,
      small_img_url: SmallImgUrl,
      large_img_url: LargeImgUrl,
      actors: Actors,
      genres: Genres,
      country: Country,
      year: Year,
    };

    try {
      await projectFirestore.collection("movies").add(newMovie);
      setTitle("");
      setAge(null);
      setTime(null);
      setDescription("");
      setYoutubeId("");
      setActors([]);
      setDirector([]);
      setScenario([]);
      setSmallImgUrl("");
      setLargeImgUrl("");
      setCountry([]);
      setGenres([]);
      setYear(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <section className="form-section">
      <h1>Přidání filmů</h1>
      <form onSubmit={submitForm}>
        <input
          className="input"
          type="text"
          placeholder="Název filmu"
          onChange={(e) => setTitle(e.target.value)}
          value={Title}
        />

        <input
          className="input"
          type="number"
          placeholder="Minimální věk"
          min="1"
          onChange={(e) => setAge(e.target.value)}
          value={Age}
        />

        <input
          className="input"
          type="number"
          placeholder="Čas filmu"
          min="1"
          onChange={(e) => setTime(e.target.value)}
          value={Time}
        />

        <input
          className="input"
          type="text"
          placeholder="Obsah"
          onChange={(e) => setDescription(e.target.value)}
          value={Description}
        />

        <input
          className="input"
          type="text"
          placeholder="youtube ID trailer"
          onChange={(e) => setYoutubeId(e.target.value)}
          value={YoutubeId}
        />

        <input
          className="input"
          type="text"
          placeholder="Odkaz na malý obrázek"
          onChange={(e) => setSmallImgUrl(e.target.value)}
          value={SmallImgUrl}
        />

        <input
          className="input"
          type="text"
          placeholder="Odkaz na velký obrázek"
          onChange={(e) => setLargeImgUrl(e.target.value)}
          value={LargeImgUrl}
        />

        <input
          className="input"
          type="number"
          placeholder="Rok vydání"
          min="1"
          onChange={(e) => setYear(e.target.value)}
          value={Year}
        />

        <input
          className="input"
          type="text"
          onChange={handleActorsChange}
          value={Actors.join(",")}
          placeholder="Herci oddělené čárkou !"
        />

        <input
          className="input"
          type="text"
          placeholder="Země oddělené čárkou !"
          onChange={handleCountryChange}
          value={Country.join(",")}
        />

        <input
          className="input"
          type="text"
          placeholder="Žánre oddělené čárkou !"
          onChange={handleGenresChange}
          value={Genres.join(",")}
        />

        <input
          className="input"
          type="text"
          placeholder="Režiséry- odděleno čárkou"
          onChange={handleDirectorChange}
          value={Director.join(",")}
        />

        <input
          className="input"
          type="text"
          placeholder="Scénáristé - odděleno čárkou"
          onChange={handleScenarioChange}
          value={Scenario.join(",")}
        />

        <input type="submit" value="Přidat film" />
      </form>
    </section>
  );
};

export default AddMovie;
