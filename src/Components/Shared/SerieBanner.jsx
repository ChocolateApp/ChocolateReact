import { useState } from "react";
import Buttons from "./Buttons";
import { IoPlayOutline, IoRefreshOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { usePost } from "../../Utils/Fetch";

export default function SerieBanner({ name, id, description, showPopup, full_banner=false }) {
    const [showBigDescription, setShowBigDescription] = useState(false);

    const { handleSubmit } = usePost()
    const { lib } = useParams()

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
            <div style={{ backgroundImage: `linear-gradient(transparent, rgb(29, 29, 29)), url("${process.env.REACT_APP_DEV_URL}/serie_banner/${id}")` }}  className="banner"></div>
            <div className="banner-data">
                <h1>{name}</h1>
                {getDescription(description)}
                <div className="banner-buttons">
                    <div className="banner-buttons-left">
                        <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={showPopup} />
                    </div>
                    <div className="banner-buttons-right">
                        <Buttons icon={<IoRefreshOutline />} text="Refresh" onClick={refresh} />
                    </div>
                </div>
            </div>
        </div>
    );
}
