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



export default function Album() {

    const { setSources, setVisible, setIsPlaying, setSourceIndex } = useAudioPlayerStore();

    const { id } = useParams();
  
    const [urls, setUrls] = useState({
      tracks: `${process.env.REACT_APP_DEV_URL}/get_album_tracks/${id}`,
      album: `${process.env.REACT_APP_DEV_URL}/get_album/${id}`
    });

    const [notFound, setNotFound] = useState(<Loading />);
  
    const { data: tracks } = useGet(urls["tracks"]);
    const { data: album } = useGet(urls["album"]);
  
    useEffect(() => {
      setUrls({
        tracks: `${process.env.REACT_APP_DEV_URL}/get_album_tracks/${id}`,
        album: `${process.env.REACT_APP_DEV_URL}/get_album/${id}`
      });
    }, [id]);
  
    return (
      <>
        <SearchAndCog setUrl={setUrls} setNotFound={setNotFound} keys={['tracks', 'album']} />
        <Back />
        {!album && notFound}
        <div className="album-div">
          <div className="album-data">
            <div className="album-cover">
              <img src={`${process.env.REACT_APP_DEV_URL}/${album?.cover}`} alt="album cover" />
            </div>
            <div className="album-infos">
              <h1>{album?.name}</h1>
              <h2>{album?.artist_name}</h2>
              <h2>{album?.tracks.split(",").length} titre{album?.tracks.split(",").length > 1 ? "s" : ""}</h2>
              <Buttons icon={<IoPlayOutline />} text="Lire" type="album-play small" onClick={() => {
                setSources(tracks);
                setSourceIndex(0);
                setVisible(true);
                setIsPlaying(true);
              }} />
            </div>
          </div>
          <div className='album-tracks'>
            {tracks && tracks.map((track, index) => (
                <TrackRow track={track} index={index+1} tracks={tracks} album={album} />
            ))}
          </div>
        </div>
      </>
    );
  }
