import { useGet, usePost } from "../../Utils/Fetch";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Buttons from "./Buttons";
import PlaylistCreatePopup from "./PlaylistCreatePopup";

import { HiPlus } from "react-icons/hi"; 
import { IoCloseOutline } from "react-icons/io5";
import { useEffect } from "react";

export default function PlaylistPopup({ trackId, hidePlaylistPopup }) {
    const { lib } = useParams()

    const [showCreatePopup, setShowCreatePopup] = useState(false)
    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_all_playlists/${lib}`)

    const { handleSubmit } = usePost()

    const { data: playlists } = useGet(url)

    function addTrackToPlaylist(playlistId) {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/add_track_to_playlist`,
            body: { playlist_id: playlistId, track_id: trackId }
        })
    }

    useEffect(() => {
        if (!showCreatePopup) {
            setUrl(`${process.env.REACT_APP_DEV_URL}/get_all_playlists/${lib}`)
        }
    }, [showCreatePopup, lib])


    return (
        <>
            <div className="playlist-popup">
                <IoCloseOutline className="crossPopup" id="crossPopup" onClick={hidePlaylistPopup} />
                <div className="playlist-popup-content">
                    <h1>Playlists</h1>
                    <div className="playlist-popup-playlists">
                        {playlists?.filter(playlist => playlist.id !== 0).map((playlist, index) => {
                            return (
                                <div className="playlist-popup-playlist" key={index} onClick={() => addTrackToPlaylist(playlist.id)}>
                                    <img src={`${process.env.REACT_APP_DEV_URL}/${playlist.cover}`} alt="playlist cover" />
                                    <div className="playlist-popup-playlist-infos">
                                        <h2>{playlist.name}</h2>
                                        <p>{playlist.tracks.split(",").length} titre{playlist.tracks.split(",").length > 1 ? "s" : ""}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <Buttons icon={<HiPlus />} text="Playlist" type="playlist-create" onClick={() => setShowCreatePopup(true)} />
                </div>
            </div>
            {showCreatePopup && <PlaylistCreatePopup setShowCreatePopup={setShowCreatePopup} trackId={trackId} />}
        </>
    )
}