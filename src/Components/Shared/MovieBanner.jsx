import { useState } from "react";
import Buttons from "./Buttons";
import { IoPlayOutline, IoDownloadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function MovieBanner({ name, url, description, id }) {
    const [showBigDescription, setShowBigDescription] = useState(false);

    const navigate = useNavigate();

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

    return (
        <div className="big-banner" data-aos="fade-down">
            <div src={url} style={{ backgroundImage: `linear-gradient(transparent, rgb(29, 29, 29)), url("${url}")` }} className="banner"></div>
            <div className="banner-data">
                <h1>{name}</h1>
                {getDescription(description)}
                <div className="banner-buttons">
                    <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={() => navigate("/movie/"+id)} />
                    <Buttons icon={<IoDownloadOutline />} text="Download" onClick={() => window.location.href = `${process.env.REACT_APP_DEV_URL}/downloadMovie/${id}`} />
                </div>
            </div>
        </div>
    );
}
