import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useGet } from '../Utils/Fetch';

import ConsoleCard from '../Components/Shared/ConsoleCard';

import SearchAndCog from '../Components/Shared/SearchAndCog';
import Loading from '../Components/Shared/Loading';


export default function Movies() {
    const { lib } = useParams();

    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_all_consoles/${lib}`)
    const [notFound, setNotFound] = useState(<Loading />)

    const { data: consoles } = useGet(url)

    const navigate = useNavigate()

    console.log(consoles)
    
    useEffect(() => {
        setUrl(`${process.env.REACT_APP_DEV_URL}/get_all_consoles/${lib}`)
    }, [lib])


    return (
        <>
            <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
            <div className="consoles">
                {Array.isArray(consoles) ? consoles.map(console => (
                    <ConsoleCard key={console.short_name} short_name={console.short_name} name={console.name} image={`${process.env.REACT_APP_DEV_URL}/${console.image}`} onClick={() => navigate(`/console/${lib}/${console.short_name}`)} />
                )) : notFound}
            </div>
        </>
    );
}
