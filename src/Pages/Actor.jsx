import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useGet } from '../Utils/Fetch';

import Back from '../Components/Shared/Back';
import MovieCard from '../Components/Shared/MovieCard';
import SerieCard from '../Components/Shared/SerieCard';

import { PopupSerie, PopupMovie } from '../Components/Shared/Popup';

export default function Actor() {
    const { id } = useParams();
  
    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_actor_data/${id}`);
    const [showPopupSerie, setShowPopupSerie] = useState(false);
    const [serieId, setSerieId] = useState(null);
    const [showPopupMovie, setShowPopupMovie] = useState(false);
    const [movieId, setMovieId] = useState(null);
  
    useEffect(() => {
      setUrl(`${process.env.REACT_APP_DEV_URL}/get_actor_data/${id}`);
    }, [id]);

    function handleSerieCardClick(id) {
        setShowPopupSerie(true);
        setShowPopupMovie(false);
        setSerieId(id);
    }

    function handleMovieCardClick(id) {
        setShowPopupMovie(true);
        setShowPopupSerie(false);
        setMovieId(id);
    }

    const { data: actor } = useGet(url);
    console.log(actor)
    return (
      <>
        <Back />        
        {actor && (
            <div className="actor">
                <div className="actor_header">
                    <img className="actor_image" src={`${process.env.REACT_APP_DEV_URL}/actor_image/${id}`} alt={id} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
                    <div className="actor_infos">
                        <h1>{actor.actor_name}</h1>
                        <p>{actor.actor_description}</p>
                    </div>
                </div>
            </div>
        )}
        {actor && actor.actor_movies && actor.actor_movies.length > 0 && (
            <div className="actor_movies">
                <h2>Movies</h2>
                <div className="movies movies_actor">
                    {actor.actor_movies.map((movie, index) => (
                        <div className="movie" key={index}>
                            <MovieCard name={movie.real_title} id={movie.id} library={movie.library} note={movie.note} vues={movie.vues} duration={movie.duration} onClick={() => handleMovieCardClick(movie.id)}/>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {actor && actor.actor_series && actor.actor_series.length > 0 && (
            <div className="actor_series">
                <h2>Series</h2>
                <div className="series series_actor">
                    {actor.actor_series.map((serie, index) => (
                        <div className="movie" key={index}>
                            <SerieCard name={serie.real_title} id={serie.id} library={serie.library} note={serie.note} vues={serie.vues} duration={serie.duration} onClick={() => handleSerieCardClick(serie.id)}/>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {showPopupSerie && <PopupSerie onClose={() => setShowPopupSerie(false)} id={serieId} />}
        {showPopupMovie && <PopupMovie onClose={() => setShowPopupMovie(false)} id={movieId} />}
      </>
    );
  }
