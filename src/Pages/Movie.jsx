import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Video from "../Components/Shared/Video";
import { useRef } from "react";
import JustCog from "../Components/Shared/JustCog";
import { useGet } from "../Utils/Fetch";
import Back from "../Components/Shared/Back";

export default function Movie() {
    const { id } = useParams()

    const playerRef = useRef(null);

    const { data } = useGet(`${process.env.REACT_APP_DEV_URL}/get_movie_data/${id}`)

    const { data: canIPlayMovie } = useGet(`${process.env.REACT_APP_DEV_URL}/can_i_play_movie/${id}`)

    const navigate = useNavigate()

    if (canIPlayMovie !== null && canIPlayMovie !== undefined) {
        if (canIPlayMovie.can_I_play === false) {
            navigate('/')
        }
    }
    
    const options = {
        autoplay: true,
        controls: true,
        preload: "none",
        techOrder: [ 'chromecast', 'html5', 'hls' ],
        sources: [{
            src: `${process.env.REACT_APP_DEV_URL}/main_movie/${id}`,
            type: "application/x-mpegURL"
        }],
        html5: {
            nativeTextTracks: false
        },
    }   

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
            <Back />
            <h1 className="videoTitle">{data?.realTitle}</h1>
            <Video options={options} onReady={handlePlayerReady} />
        </>
    );
}
