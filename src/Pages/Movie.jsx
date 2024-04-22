import { useParams, useNavigate } from "react-router-dom";
import Video from "../Components/Shared/Video";
import JustCog from "../Components/Shared/JustCog";
import { useGet } from "../Utils/Fetch";
import Back from "../Components/Shared/Back";

export default function Movie() {
    const { id } = useParams()

    const { data } = useGet(`${process.env.REACT_APP_DEV_URL}/get_movie_data/${id}`)

    const { data: canIPlayMovie } = useGet(`${process.env.REACT_APP_DEV_URL}/can_i_play_movie/${id}`)

    const navigate = useNavigate()

    if (canIPlayMovie !== null && canIPlayMovie !== undefined) {
        if (canIPlayMovie.can_I_play === false) {
            navigate('/')
        }
    }

    const options = {
        title: data?.realTitle,
        sources: [{
            src: `${process.env.REACT_APP_DEV_URL}/main_movie/${id}`,
            type: "application/vnd.apple.mpegurl"
        }],
        cover: `${process.env.REACT_APP_DEV_URL}/movie_cover/${id}`,
    }

    return (
        <>
            <JustCog />
            <Back />
            <h1 className="videoTitle">{data?.realTitle}</h1>
            <Video options={options} />
        </>
    );
}
