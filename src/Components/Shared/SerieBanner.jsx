import { useState } from "react";
import Buttons from "./Buttons";
import { IoPlayOutline } from "react-icons/io5";

export default function SerieBanner({ name, url, description, showPopup }) {
    const [showBigDescription, setShowBigDescription] = useState(false);

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
                    <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={showPopup} />
                </div>
            </div>
        </div>
    );
}
