import { useParams, useNavigate } from "react-router-dom";
import Video from "../Components/Shared/Video";
import JustCog from "../Components/Shared/JustCog";
import { useGet } from "../Utils/Fetch";
import Back from "../Components/Shared/Back";

export default function Other() {
    const { id } = useParams()

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
        techOrder: ['chromecast', 'html5', 'hls'],
        sources: [{
            src: `${process.env.REACT_APP_DEV_URL}/main_other/${id}`,
            type: "application/x-mpegURL"
        }],
        html5: {
            nativeTextTracks: false
        }
    };

    return (
        <>
            <JustCog />
            <Back />
            <Video options={options} />
        </>
    );
}
