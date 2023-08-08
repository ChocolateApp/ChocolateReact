import { useNavigate, useParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Video from "../Components/Shared/Video";
import { useRef } from "react";
import JustCog from "../Components/Shared/JustCog";
import { useGet } from "../Utils/Fetch";
import Buttons from "../Components/Shared/Buttons";

import Back from "../Components/Shared/Back";

export default function Movie() {
    const { id } = useParams()

    const playerRef = useRef(null);

    const navigate = useNavigate();

    const { data: episode } = useGet(`${process.env.REACT_APP_DEV_URL}/get_episode_data/${id}`)

    console.log(episode)

    const { data: canIPlayEpisode } = useGet(`${process.env.REACT_APP_DEV_URL}/can_i_play_episode/${id}`)

    if (canIPlayEpisode !== null && canIPlayEpisode !== undefined) {
        if (canIPlayEpisode.canIPlay === false) {
            navigate('/')
        }
    }
    
    const options = {
        autoplay: true,
        controls: true,
        preload: "none",
        techOrder: [ 'chromecast', 'html5' ],
        sources: [{
            src: `${process.env.REACT_APP_DEV_URL}/main_serie/${id}`,
            type: "application/x-mpegURL"
        }],
        html5: {
            nativeTextTracks: false
        },
    };

    const handlePlayerReady = (player, setUrl) => {
        playerRef.current = player;
        
        // You can handle player events here, for example:
        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });
        player.on("timeupdate", () => {
            //handleTimeUpdate()
        });
    }

    return (
        <>
            <JustCog />
            <Back path={"/season/"+episode?.seasonId} />
            <h1 className="videoTitle">EP{episode?.episodeNumber} - {episode?.episodeName}</h1>
            <Video options={options} onReady={handlePlayerReady} />
            <div className="episodeButtons">
                { episode?.previousEpisode ? (
                    <Buttons text="Previous episode" onClick={() => navigate("/episode/"+episode?.previousEpisode)} />
                ) : (
                    <div></div>
                ) }
                { episode?.nextEpisode ? (
                    <Buttons text="Next episode" onClick={() => navigate("/episode/"+episode?.nextEpisode)} /> 
                ) : (
                    <div></div>
                ) }
            </div>
        </>
    );
}
