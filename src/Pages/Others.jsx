import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useGet } from "../Utils/Fetch";
import SearchAndCog from "../Components/Shared/SearchAndCog";
import Loading from "../Components/Shared/Loading";
import OtherBanner from "../Components/Shared/OtherBanner";

export default function Others() {

    const { lib } = useParams();

    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_all_others/${lib}`)
    const [notFound, setNotFound] = useState(<Loading />)

    const { data: others } = useGet(url)
    const [firstOther, ...restOthers] = others || [];

    useEffect(() => {
        setUrl(`${process.env.REACT_APP_DEV_URL}/get_all_others/${lib}`)
    }, [lib])

    useEffect(() => {
        console.log(others)
    }, [others])

    return (
        <>
            <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
            { firstOther ? (
                <OtherBanner name={firstOther.title} url={`${process.env.REACT_APP_DEV_URL}/other_cover/${firstOther.video_hash}`} hash={firstOther.video_hash} />
            ) : notFound}
            <div className="others">
                {Array.isArray(restOthers) ? restOthers.map(other => (
                    <Link to={`/other/${other.video_hash}`} className="other-card">
                        <img src={`${process.env.REACT_APP_DEV_URL}/other_cover/${other.video_hash}`} alt={other.title} />
                        <h3>{other.title}</h3>
                    </Link>
                )) : null}
            </div>
        </>
    )
}
