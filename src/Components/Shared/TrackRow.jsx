import { useState, useEffect, useRef } from "react";

import { IoPlayOutline, IoThumbsUpOutline, IoThumbsUp } from "react-icons/io5";
import { MdPlaylistAdd } from "react-icons/md";

import { useAudioPlayerStore } from "../../App";
import { usePost } from "../../Utils/Fetch";
import PlaylistPopup from './PlaylistPopup';

export default function TrackRow({ track, index, tracks, album={} }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [sendLike, setSendLike] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const rowRef = useRef(null);

    const { setSources, setVisible, setIsPlaying, setSourceIndex, sources } = useAudioPlayerStore();
  
    function getDuration(duration) {
        let minutes = Math.floor(duration / 60);
        let seconds = Math.round(duration - minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return `${minutes}:${seconds}`;
    }

    const { handleSubmit } = usePost()

    useEffect(() => {
        if (track) {
            setIsLiked(track.liked);
        }
    }, [track]);

    useEffect(() => {
        if (sendLike !== null) {
            handleSubmit({
                url: `${process.env.REACT_APP_DEV_URL}/likeTrack/${track.id}/${localStorage.getItem('id')}`
            });
        }
    }, [sendLike]);

    function handleMouseEnter() {
        setIsHovered(true);
    }

    function handleMouseLeave() {
        setIsHovered(false);
    }
    
    function handlePlay() {
        setVisible(true);
        setIsPlaying(true);
        setSources(tracks);
        setSourceIndex(index-1);
    }

    function handleLike(event) {
        event.stopPropagation();
        setIsLiked(!isLiked);
        setSendLike(!isLiked);
    }

    function handlePlaylist(event) {
        event.stopPropagation();
        setShowPopup(true);
    }

    function hidePlaylistPopup(event) {
        setShowPopup(false);
    }
    


    return (
        <>
        {showPopup && <PlaylistPopup trackId={track.id} hidePlaylistPopup={hidePlaylistPopup} />}
        <div className='album-track' key={track.id-tracks[0].id} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handlePlay} ref={rowRef}>
            {isHovered && (
                <div className='track-row-hover' style={{ width: `calc(${rowRef.current?.offsetWidth}px - 4rem)` }}>
                    <IoPlayOutline className='track-row-play' />
                    <div>
                        {isLiked ? <IoThumbsUp className='track-row-like' onClick={handleLike} /> : <IoThumbsUpOutline className='track-row-like' onClick={handleLike} />}
                        <MdPlaylistAdd className='track-row-playlist' onClick={handlePlaylist} />
                    </div>
                </div>
            )}
            <h3 className='track-id'>{index}</h3>
            <h3 className='track-name'>{track.name}</h3>
            <h3 className='track-artist'>{album?.artist_name || track?.artist_name}</h3>
            <h3 className='track-duration'>{getDuration(track.duration)}</h3>
        </div>
        </>
    )
}