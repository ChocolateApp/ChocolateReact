import { IoPlayOutline, IoDownloadOutline } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";
import 'react-circular-progressbar/dist/styles.css';
import Buttons from './Buttons';


export default function EpisodeCard({ name, description, url, id, number }) {

    const navigate = useNavigate();
    
    if (url && !url.includes("http")) {
        url = `${process.env.REACT_APP_DEV_URL}/${url}`
    }

    return (
        <div className="episode-card" >
            <img src={url} alt={name} loading="lazy"/>
            <div className="episode-card-left">
                <h1>{`EP${number} - ${name}`}</h1>
                <p>{description}</p>
                <div className="episode-card-buttons">
                    <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={() => navigate("/episode/"+id)} />
                    <Buttons icon={<IoDownloadOutline />} text="Download" onClick={() => window.location.href = `${process.env.REACT_APP_DEV_URL}/download_episode/${id}`} />
                </div>
            </div>
        </div>
    );
}