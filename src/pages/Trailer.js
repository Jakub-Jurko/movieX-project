import "./Trailer.css";

const Trailer = ({ videoId }) => {
  return <div>
      <iframe
              className="video"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            >

            </iframe>
  </div>
  
};

export default Trailer;
