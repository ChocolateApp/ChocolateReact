import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useGet } from '../Utils/Fetch';

import Buttons from '../Components/Shared/Buttons';

import { IoPlayOutline } from 'react-icons/io5';

import SearchAndCog from '../Components/Shared/SearchAndCog';
import Loading from '../Components/Shared/Loading';

import { useAudioPlayerStore } from '../App';
import Back from '../Components/Shared/Back';
import TrackRow from '../Components/Shared/TrackRow';
import PlaylistPopup from '../Components/Shared/PlaylistPopup';



export default function Playlist() {

    const { setSources, setVisible, setIsPlaying, setSourceIndex } = useAudioPlayerStore();

    const { id } = useParams();
  
    const [urls, setUrls] = useState({
      tracks: `${process.env.REACT_APP_DEV_URL}/get_playlist_tracks/${id}`,
      playlist: `${process.env.REACT_APP_DEV_URL}/get_playlist/${id}`
    });

    const [notFound, setNotFound] = useState(<Loading />);
    const [trackId, setTrackId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
  
    const { data: tracks } = useGet(urls["tracks"]);
    const { data: playlist } = useGet(urls["playlist"]);
  
    useEffect(() => {
      setUrls({
        tracks: `${process.env.REACT_APP_DEV_URL}/get_playlist_tracks/${id}`,
        playlist: `${process.env.REACT_APP_DEV_URL}/get_playlist/${id}`
      });
    }, [id]);

    function showPlaylistPopup(id) {
      setTrackId(id);
      setShowPopup(true);
    }

    function hidePlaylistPopup(event) {
      setShowPopup(false);
    }

  
    return (
      <>
        <SearchAndCog setUrl={setUrls} setNotFound={setNotFound} keys={['tracks', 'playlist']} />
        <Back />
        {showPopup && <PlaylistPopup trackId={trackId} hidePlaylistPopup={hidePlaylistPopup} />}
        <div className="playlist-div">
          <div className="playlist-data">
            <div className="playlist-cover">
              <img src={`${process.env.REACT_APP_DEV_URL}/${playlist?.cover}`} alt="playlist cover" />
            </div>
            <div className="playlist-infos">
              <h1>{playlist?.name}</h1>
              <h2>{playlist?.artist_name}</h2>
              <h2>{playlist?.tracks.split(",").length} titre{playlist?.tracks.split(",").length > 1 ? "s" : ""}</h2>
              <Buttons icon={<IoPlayOutline />} text="Lire" type="playlist-play" onClick={() => {
                setSources(tracks);
                setSourceIndex(0);
                setVisible(true);
                setIsPlaying(true);
              }} />
            </div>
          </div>
          <div className='playlist-tracks'>
            {tracks ? tracks.map((track, index) => (
                <TrackRow track={track} index={index+1} tracks={tracks} showPlaylistPopup={showPlaylistPopup} />
            )) : notFound}
          </div>
        </div>
      </>
    );
  }