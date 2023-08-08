import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import { useGet } from "../Utils/Fetch";

import SearchAndCog from "../Components/Shared/SearchAndCog";
import Loading from '../Components/Shared/Loading';

export default function TVs() {

    const { lib } = useParams();

    const [notFound, setNotFound] = useState(<Loading />)
    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_channels/${lib}`)

    const { data: channels} = useGet(url)

    return (
        <>
            <SearchAndCog setNotFound={setNotFound} setUrl={setUrl} />
            <div className="channels">
                {Array.isArray(channels) ? channels.map(channel => (
                    <Link to={`/channel/${lib}/${channel.channelID}`} key={channel.id} className="channel-card" data-aos="fade-up">
                        <img src={`${channel.logo}`} alt={channel.name} 
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`
                            }}
                        />
                        <p>{channel.name}</p>
                    </Link>
                )) : notFound}
            </div>
        </>
    );
}