import { useParams, useNavigate } from "react-router-dom";
import Video from "../Components/Shared/Video";
import JustCog from "../Components/Shared/JustCog";
import { useGet } from "../Utils/Fetch";
import { useEffect, useState } from "react";
import Back from "../Components/Shared/Back";

import Buttons from "../Components/Shared/Buttons";

export default function Channel() {
    const { lib, id } = useParams()

    const navigate = useNavigate()

    const [channelData, setChannelData] = useState(null)

    const { data } = useGet(`${process.env.REACT_APP_DEV_URL}/get_tv/${lib}/${id}`)


    useEffect(() => {
        if (data)
            setChannelData(data)
    }, [data])

    const options = {
        autoplay: true,
        controls: true,
        preload: "none",
        techOrder: ['chromecast', 'html5', 'hls'],
        sources: [{
            src: channelData && channelData.channel_url ? channelData.channel_url : "",
            type: "application/x-mpegURL"
        }],
        html5: {
            nativeTextTracks: false
        }
    };

    return (
        <>
            <JustCog />
            <Back path={`/tv/${lib}`} />
            <h1 className="videoTitle">{channelData?.channel_name}</h1>
            <Video options={options} />
            <div className="episodeButtons">
                {channelData?.previous_id !== null && (
                    <Buttons text="previous" onClick={() => navigate(`/channel/${lib}/${channelData.previous_id}`)} />
                )}
                {channelData?.next_id !== null && (
                    <Buttons text="next" onClick={() => navigate(`/channel/${lib}/${channelData.next_id}`)} />
                )}
            </div>
        </>
    );
}
