import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useGet } from '../Utils/Fetch';

import GameCard from '../Components/Shared/GameCard';

import SearchAndCog from '../Components/Shared/SearchAndCog';
import Loading from '../Components/Shared/Loading';


export default function Movies() {
    const { lib, console } = useParams();

    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_all_games/${lib}/${console}`)
    const [notFound, setNotFound] = useState(<Loading />)

    const { data: games } = useGet(url)

    const navigate = useNavigate()
    
    useEffect(() => {
        setUrl(`${process.env.REACT_APP_DEV_URL}/get_all_games/${lib}/${console}`)
    }, [lib, console])


    return (
        <>
            <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
            <div className="games">
                {Array.isArray(games) ? games.map(system => (
                    <GameCard key={system.id} title={system.title} cover={system.cover} onClick={() => navigate(`/game/${lib}/${console}/${system.id}`)} /> 
                )) : notFound}
            </div>
        </>
    );
}
