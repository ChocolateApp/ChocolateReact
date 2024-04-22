import { useState } from "react";
import Buttons from "./Buttons";
import { IoPlayOutline, IoDownloadOutline, IoRefreshOutline } from "react-icons/io5";
import { useNavigate, useParams} from "react-router-dom";
import { usePost } from "../../Utils/Fetch";

export default function MovieBanner({ name, description, id, full_banner=false }) {
    const [showBigDescription, setShowBigDescription] = useState(false);

    const { lib } = useParams();

    const navigate = useNavigate();

    const { handleSubmit } = usePost()

    function toggleDescription() {
        setShowBigDescription(!showBigDescription);
    }

    function getDescription(description) {
        if (description && description.length > 200) {
            const shortDescription = description.slice(0, 200);
            return (
                <p className="banner-description" style={{ overflowY: showBigDescription ? "scroll" : "hidden" }}>
                    {showBigDescription ? description : shortDescription} 
                    <span className="more" onClick={toggleDescription}>
                        {showBigDescription ? "less" : "... more"}
                    </span>
                </p>
            )
        } else {
            return (
                <p className="banner-description">{description}</p>
            )
        }
    }

    function refresh() {
        handleSubmit({
            url:`${process.env.REACT_APP_DEV_URL}/rescan/${lib}`
        })
    }

    return (
        <div className={`big-banner ${full_banner ? "full-banner" : ""}`} data-aos="fade-down">
            <div src={`${process.env.REACT_APP_DEV_URL}/movie_banner/${id}`} style={{ backgroundImage: `linear-gradient(transparent, rgb(29, 29, 29)), url("${process.env.REACT_APP_DEV_URL}/movie_banner/${id}")` }} className="banner"></div>
            <div className="banner-data">
                <h1>{name}</h1>
                {getDescription(description)}
                <div className="banner-buttons">
                    <div className="banner-buttons-left">
                        <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={() => navigate("/movie/"+id)} />
                        <Buttons icon={<IoDownloadOutline />} text="Download" onClick={() => window.location.href = `${process.env.REACT_APP_DEV_URL}/download_movie/${id}`} />
                    </div>
                    <div className="banner-buttons-right">
                        <Buttons icon={<IoRefreshOutline />} text="Refresh" onClick={refresh} />
                    </div>
                </div>
            </div>
        </div>
    );
}
