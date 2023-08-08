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

    return (
        <>
            <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
            { firstOther ? (
                <OtherBanner name={firstOther.title} url={`${process.env.REACT_APP_DEV_URL}/${firstOther.banner}`} hash={firstOther.videoHash} />
            ) : notFound}
            <div className="others">
                {Array.isArray(restOthers) ? restOthers.map(other => (
                    <Link to={`/other/${other.videoHash}`} className="other-card">
                        <img src={`${process.env.REACT_APP_DEV_URL}/${other.banner}`} alt={other.title} />
                        <h3>{other.title}</h3>
                    </Link>
                )) : null}
            </div>
        </>
    )
}