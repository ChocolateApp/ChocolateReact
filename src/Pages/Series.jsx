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

    function handleMovieCardClick(id) {
        setShowPopup(true);
        setMovieId(id);
    }

    function toFixedIfNecessary( value, dp ){
        return +parseFloat(value).toFixed( dp );
    }

    return (
        <>
            <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
            {showPopup && <PopupSerie onClose={() => setShowPopup(false)} id={serieId} />}
            { firstSerie ? (
                <SerieBanner name={firstSerie.name} url={`${process.env.REACT_APP_DEV_URL}/${firstSerie.banniere}`} description={firstSerie.description} showPopup={() => handleMovieCardClick(firstSerie.id)} />
            ) : notFound}
            {restSeries.length > 0 || firstSerie ? (
                <div className='series'>
                    {Array.isArray(restSeries) ? restSeries.map(serie => (
                        <SerieCard key={serie.id} name={serie.name} url={`${process.env.REACT_APP_DEV_URL}/${serie.serie_cover_path}`} onClick={() => handleMovieCardClick(serie.id)} library={lib} percent={toFixedIfNecessary(serie.note, 1)*10} />
                        )) : null}
                        </div>
                ) : null}
        </>
    );
}
