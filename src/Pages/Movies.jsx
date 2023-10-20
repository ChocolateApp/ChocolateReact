import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MovieCard from '../Components/Shared/MovieCard';
import MovieBanner from '../Components/Shared/MovieBanner';
import { PopupMovie } from '../Components/Shared/Popup';
import SearchAndCog from '../Components/Shared/SearchAndCog';
import Loading from '../Components/Shared/Loading';

import { useGet } from '../Utils/Fetch';

export default function Movies() {
    const { lib } = useParams();
    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_all_movies/${lib}`)
    const [notFound, setNotFound] = useState(<Loading />)

    const { data: films } = useGet(url)
    const [firstFilm, ...restFilms] = films || [];

    const isAdmin = localStorage.getItem('account_type')?.toLowerCase() === 'admin';

    const [showPopup, setShowPopup] = useState(false);
    const [movieId, setMovieId] = useState(null);

    
    useEffect(() => {
        setUrl(`${process.env.REACT_APP_DEV_URL}/get_all_movies/${lib}`)
    }, [lib])

    function handleMovieCardClick(id) {
        setShowPopup(true);
        setMovieId(id);
    }

    return (
        <>
            <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
            {showPopup && <PopupMovie onClose={() => setShowPopup(false)} id={movieId} />}
            { firstFilm ? (
                <MovieBanner name={firstFilm.real_title} description={firstFilm.description} id={firstFilm.id} full_banner={restFilms.length === 0} />
            ) : notFound}
            {restFilms.length > 0 || firstFilm ? (
                    <div className='movies'>
                        {Array.isArray(restFilms) ? restFilms.map((film, index) => (
                            <MovieCard isAdmin={isAdmin} key={index} name={film.real_title} onClick={() => handleMovieCardClick(film.id)} id={film.id} library={lib} note={film.note} vues={{}} duration={film.duration} />
                        )) : null }
                    </div>
            ) : null}
        </>
    );
}
