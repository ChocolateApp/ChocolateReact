import Buttons from "./Buttons";
import { IoPlayOutline, IoDownloadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function OtherBanner({ name, url, hash }) {

    const navigate = useNavigate();

    return (
        <div className="big-banner">
            <div src={url} style={{ backgroundImage: `linear-gradient(transparent, rgb(29, 29, 29)), url("${url}")` }} className="banner"></div>
            <div className="banner-data">
                <h1>{name}</h1>
                <div className="banner-buttons">
                    <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={() => navigate("/other/"+hash)} />
                    <Buttons icon={<IoDownloadOutline />} text="Download" onClick={() => window.location.href = `${process.env.REACT_APP_DEV_URL}/download_other/${hash}`} />
                </div>
            </div>
        </div>
    );
}
