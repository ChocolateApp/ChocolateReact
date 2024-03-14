import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useGet } from '../Utils/Fetch';

import SerieCard from '../Components/Shared/SerieCard';
import SerieBanner from '../Components/Shared/SerieBanner';

import { PopupSerie } from '../Components/Shared/Popup';

import SearchAndCog from '../Components/Shared/SearchAndCog';

import Loading from '../Components/Shared/Loading';


export default function Series() {
    const { lib } = useParams();

    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_all_series/${lib}`);
    const [notFound, setNotFound] = useState(<Loading />);
    const [showPopup, setShowPopup] = useState(false);
    const [serieId, setMovieId] = useState(null);

    const { data: series } = useGet(url);
    const [firstSerie, ...restSeries] = series || [];

    useEffect(() => {
        setUrl(`${process.env.REACT_APP_DEV_URL}/get_all_series/${lib}`);
    }, [lib]);

    function handleSerieCardClick(id) {
        setShowPopup(true);
        setMovieId(id);
    }

    return (
        <>
            <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
            {showPopup && <PopupSerie onClose={() => setShowPopup(false)} id={serieId} />}
            { firstSerie ? (
                <SerieBanner name={firstSerie.name} id={firstSerie.id} description={firstSerie.description} showPopup={() => handleSerieCardClick(firstSerie.id)} full_banner={restSeries.length === 0} />
            ) : notFound}
            {restSeries.length > 0 || firstSerie ? (
                <div className='series'>
                    {Array.isArray(restSeries) ? restSeries.map(serie => (
                        <SerieCard key={serie.id} name={serie.name} id={serie.id} onClick={() => handleSerieCardClick(serie.id)} library={lib} note={serie.note} />
                        )) : null}
                        </div>
                ) : null}
        </>
    );
}
