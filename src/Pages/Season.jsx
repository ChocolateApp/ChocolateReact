import { useParams } from "react-router-dom";

import { useGet } from "../Utils/Fetch";
import JustCog from "../Components/Shared/JustCog";
import { useState } from "react";

import EpisodeBanner from "../Components/Shared/EpisodeBanner.jsx";
import EpisodeCard from "../Components/Shared/EpisodeCard";
import Loading from "../Components/Shared/Loading";
import Back from "../Components/Shared/Back";

export default function Season() {
    const { id } = useParams()

    // eslint-disable-next-line
    const [notFound, setNotFound] = useState(<Loading />)

    const { data: episodes } = useGet(`${process.env.REACT_APP_DEV_URL}/get_episodes/${id}`)

    const [firstEpisode, ...restEpisodes] = episodes?.episodes || [];

    console.log(episodes)

    return (
        <>
            <JustCog />
            <Back path={`/series/${episodes?.library}`} />
            {firstEpisode ? (
                <EpisodeBanner key={firstEpisode.episode_id} name={firstEpisode.episode_name} url={firstEpisode.episode_cover_path} description={firstEpisode.episode_description} id={firstEpisode.episode_id} number={firstEpisode.episode_number} />
            ) : notFound
            }
            <div className='episodes'>
                {Array.isArray(restEpisodes) ? restEpisodes.map((episode, index) => (
                    <EpisodeCard key={index} name={episode.episode_name} description={episode.episode_description} url={episode.episode_cover_path} id={episode.episode_id} number={episode.episode_number} />
                )) : <p>{notFound}</p>}
            </div>
        </>
    );
}
