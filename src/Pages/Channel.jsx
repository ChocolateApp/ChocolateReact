import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Video from "../Components/Shared/Video";
import { useRef } from "react";
import JustCog from "../Components/Shared/JustCog";
import { useGet } from "../Utils/Fetch";
import { useEffect, useState } from "react";
import Back from "../Components/Shared/Back";

import Buttons from "../Components/Shared/Buttons";

export default function Channel() {
    const { lib, id } = useParams()

    const navigate = useNavigate()

    const [channelData, setChannelData] = useState(null)

    const playerRef = useRef(null);

    const { data } = useGet(`${process.env.REACT_APP_DEV_URL}/get_tv/${lib}/${id}`)
    
    console.log(data)

    useEffect(() => {
        if (data)
            setChannelData(data)
    }, [data])

    const options = {
        autoplay: true,
        controls: true,
        preload: "none",
        techOrder: [ 'chromecast', 'html5', 'hls' ],
        sources: [{
            src: channelData && channelData.channel_url ? channelData.channel_url : "",
            type: "application/x-mpegURL"
        }],
        html5: {
            nativeTextTracks: false
        }
    };

    console.log(options)

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
            <Back path={`/tv/${lib}`} />
            <h1 className="videoTitle">{channelData?.channel_name}</h1>
            <Video options={options} onReady={handlePlayerReady} />
            <div className="episodeButtons">
                { channelData?.previous_id !== null && (
                    <Buttons text="previous" onClick={() => navigate(`/channel/${lib}/${channelData.previous_id}`)} />
                )}
                { channelData?.next_id !== null && (
                    <Buttons text="next" onClick={() => navigate(`/channel/${lib}/${channelData.next_id}`)} />
                )}
            </div>
        </>
    );
}
