import { useNavigate, useParams } from "react-router-dom";

import { useGet } from "../Utils/Fetch";
import { useLangage } from '../Utils/useLangage';

import Video from "../Components/Shared/Video";
import JustCog from "../Components/Shared/JustCog";
import Back from "../Components/Shared/Back";

export default function Movie() {
    const { id } = useParams()

    const navigate = useNavigate();
    const { getLang } = useLangage();

    const { data: episode } = useGet(`${process.env.REACT_APP_DEV_URL}/get_episode_data/${id}`)

    const { data: canIPlayEpisode } = useGet(`${process.env.REACT_APP_DEV_URL}/can_i_play_episode/${id}`)

    if (canIPlayEpisode !== null && canIPlayEpisode !== undefined) {
        if (canIPlayEpisode.can_I_play === false) {
            navigate('/')
        }
    }

    const options = {
        autoplay: true,
        controls: true,
        preload: "none",
        techOrder: ['chromecast', 'html5', 'hls'],
        sources: [{
            src: `${process.env.REACT_APP_DEV_URL}/main_serie/${id}`,
            type: "application/x-mpegURL"
        }],
        html5: {
            nativeTextTracks: false
        },
    };


    return (
        <>
            <JustCog />
            <Back path={"/season/" + episode?.season_id} />
            <h1 className="videoTitle">EP{episode?.episode_number} - {episode?.episode_name}</h1>
            <Video options={options} previousURL={"/episode/" + episode?.previous_episode} nextURL={"/episode/" + episode?.next_episode} previousText={getLang("previous")} nextText={getLang("next")} />
        </>
    );
}
