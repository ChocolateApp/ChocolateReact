import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useGet } from '../Utils/Fetch';

import Buttons from '../Components/Shared/Buttons';

import { IoShuffleOutline } from 'react-icons/io5';

import SearchAndCog from '../Components/Shared/SearchAndCog';
import Loading from '../Components/Shared/Loading';

import { useAudioPlayerStore } from '../App';
import Back from '../Components/Shared/Back';
import TrackRow from '../Components/Shared/TrackRow';
import { AlbumCarousel } from '../Components/Shared/MusicCarousel';



export default function Artist() {

    const { setSources, setVisible, setIsPlaying, setSourceIndex } = useAudioPlayerStore();

    const { lib, id } = useParams();
  
    const [urls, setUrls] = useState({
      tracks: `${process.env.REACT_APP_DEV_URL}/get_artist_tracks/${id}`,
      albums: `${process.env.REACT_APP_DEV_URL}/get_artist_albums/${id}`,
      artist: `${process.env.REACT_APP_DEV_URL}/get_artist/${id}`
    });
    const [notFound, setNotFound] = useState(<Loading />);
  
    const { data: tracks } = useGet(urls["tracks"]);
    const { data: albums } = useGet(urls["albums"]);
    const { data: artist } = useGet(urls["artist"]);
  
    useEffect(() => {
      setUrls({
        tracks: `${process.env.REACT_APP_DEV_URL}/get_artist_tracks/${id}`,
        albums: `${process.env.REACT_APP_DEV_URL}/get_artist_albums/${id}`,
        artist: `${process.env.REACT_APP_DEV_URL}/get_artist/${id}`
      });
    }, [id]);
  

    function shuffleAndPlay() {
      let list = [...tracks].sort(() => Math.random() - 0.5);
      console.log(list);
      setSources(list);
      setSourceIndex(0);
      setVisible(true);
      setIsPlaying(true);
    }

    return (
      <>
        <SearchAndCog setUrl={setUrls} setNotFound={setNotFound} keys={['tracks', 'artist']} />
        <Back />
        { !tracks && !artist && notFound }
        <div className="artist-div">
          <div className="artist-data">
            <div className="artist-cover">
              <img src={`${process.env.REACT_APP_DEV_URL}/${artist?.cover}`} alt="artist cover" />
            </div>
            <div className="artist-infos">
              <h1>{artist?.name}</h1>
              <Buttons icon={<IoShuffleOutline />} text="Aléatoire" type="artist-play" onClick={shuffleAndPlay} />
            </div>
          </div>
          { albums && albums.length > 0 && <AlbumCarousel albums={albums} lib={lib} /> }          
          <div className='artist-tracks'>
            {tracks && tracks.map((track, index) => (
                <TrackRow track={track} index={index+1} tracks={tracks} />
            ))}
          </div>
        </div>
      </>
    );
  }