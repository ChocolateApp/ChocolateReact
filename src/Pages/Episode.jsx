import { useNavigate, useParams } from "react-router-dom";

import { useGet } from "../Utils/Fetch";
import { useLangage } from '../Utils/useLangage';

import Video from "../Components/Shared/Video";
import JustCog from "../Components/Shared/JustCog";
import Back from "../Components/Shared/Back";
import { useEffect, useState } from "react";

export default function Movie() {
    const { id } = useParams()

    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_episode_data/${id}`);
    const [episodeUrl, setEpisodeUrl] = useState(`${process.env.REACT_APP_DEV_URL}/main_serie/${id}`);

    const navigate = useNavigate();
    const { getLang } = useLangage();

    const { data: episode } = useGet(url);

    useEffect(() => {
        setUrl(`${process.env.REACT_APP_DEV_URL}/get_episode_data/${id}`);
        setEpisodeUrl(`${process.env.REACT_APP_DEV_URL}/main_serie/${id}`);
    }, [id]);

    const { data: canIPlayEpisode } = useGet(`${process.env.REACT_APP_DEV_URL}/can_i_play_episode/${id}`)

    if (canIPlayEpisode !== null && canIPlayEpisode !== undefined) {
        if (canIPlayEpisode.can_I_play === false) {
            navigate('/')
        }
    }

    const options = {
        title: `EP${episode?.episode_number} - ${episode?.episode_name}`,
        sources: [{
            src: episodeUrl,
            type: "application/vnd.apple.mpegurl"
        }],
        cover: `${process.env.REACT_APP_DEV_URL}/episode_cover/${episode?.episode_id}`,
        next_episode: `/episode/${episode?.next_episode}`,
        previous_episode: `/episode/${episode?.previous_episode}`,
        next_text: getLang("next"),
        previous_text: getLang("previous"),
        periods_to_skip: episode?.recurring,
    };


    return (
        <>
            <JustCog />
            <Back path={"/season/" + episode?.season_id} />
            <h1 className="videoTitle">EP{episode?.episode_number} - {episode?.episode_name}</h1>
            <Video options={options} />
        </>
    );
}
