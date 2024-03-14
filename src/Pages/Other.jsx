import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Video from "../Components/Shared/Video";
import { useRef } from "react";
import JustCog from "../Components/Shared/JustCog";
import { useGet } from "../Utils/Fetch";
import Back from "../Components/Shared/Back";

export default function Other() {
    const { id } = useParams()

    const playerRef = useRef(null);

    const { data: canIPlayOther } = useGet(`${process.env.REACT_APP_DEV_URL}/can_i_play_other_video/${id}`)

    const navigate = useNavigate()

    console.log(canIPlayOther)

    if (canIPlayOther !== null && canIPlayOther !== undefined) {
        if (canIPlayOther.can_I_play === false) {
            navigate('/')
        }
    }
    
    const options = {
        autoplay: true,
        controls: true,
        preload: "none",
        techOrder: [ 'chromecast', 'html5', 'hls' ],
        sources: [{
            src: `${process.env.REACT_APP_DEV_URL}/main_other/${id}`,
            type: "application/x-mpegURL"
        }],
        html5: {
            nativeTextTracks: false
        }
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
            <Back />
            <Video options={options} onReady={handlePlayerReady} />
        </>
    );
}
