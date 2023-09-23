import Buttons from "./Buttons";
import { usePost } from "../../Utils/Fetch";
import { useParams } from "react-router-dom";

export default function PlaylistCreatePopup({ setShowCreatePopup, trackId }) {
    const { lib } = useParams()

    const { handleSubmit } = usePost();

    const createPlaylist = () => {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/createPlaylist`,
            body: { name: document.getElementById("playlist-name").value, user_id: localStorage.getItem("id"), track_id: trackId, library: lib }
        })
        setShowCreatePopup(false);
    }

    return (
        <div className="playlist-create-popup">
            <h1>Create a playlist</h1>

            <div className="playlist-create-input">
                <label htmlFor="playlist-name">Playlist name</label>
                <input type="text" name="playlist-name" id="playlist-name" className="input" />
            </div>

            <div className="playlist-create-buttons">
                <Buttons text="Create" type="playlist-create small" onClick={createPlaylist} />
            </div>    
        </div>
    );
}
