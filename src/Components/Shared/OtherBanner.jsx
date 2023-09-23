import Buttons from "./Buttons";
import { IoPlayOutline, IoDownloadOutline, IoRefreshOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "../../Utils/Fetch";

export default function OtherBanner({ name, url, hash }) {

    const navigate = useNavigate();
    const { handleSubmit } = usePost()
    const { lib } = useParams()

    
    function refresh() {
        handleSubmit({
            url:`${process.env.REACT_APP_DEV_URL}/rescan/${lib}`
        })
    }

    return (
        <div className="big-banner">
            <div src={url} style={{ backgroundImage: `linear-gradient(transparent, rgb(29, 29, 29)), url("${url}")` }} className="banner"></div>
            <div className="banner-data">
                <h1>{name}</h1>
                <div className="banner-buttons">
                    <div className="banner-buttons-left">
                        <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={() => navigate("/other/"+hash)} />
                        <Buttons icon={<IoDownloadOutline />} text="Download" onClick={() => window.location.href = `${process.env.REACT_APP_DEV_URL}/download_other/${hash}`} />
                    </div>
                    <div className="banner-buttons-right">
                        <Buttons icon={<IoRefreshOutline />} text="Refresh" onClick={refresh} />
                    </div>
                </div>
            </div>
        </div>
    );
}
