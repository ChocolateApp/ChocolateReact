import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useGet } from '../Utils/Fetch';

import { PlaylistCarousel, AlbumCarousel, ArtistCarousel, TracksCarousel } from '../Components/Shared/MusicCarousel';

import SearchAndCog from '../Components/Shared/SearchAndCog';
import Loading from '../Components/Shared/Loading';


export default function Musics() {
    const { lib } = useParams();

    const [urls, setUrls] = useState({
        playlists: `${process.env.REACT_APP_DEV_URL}/get_all_playlists/${lib}`,
        albums: `${process.env.REACT_APP_DEV_URL}/get_all_albums/${lib}`,
        artists: `${process.env.REACT_APP_DEV_URL}/get_all_artists/${lib}`,
        tracks: `${process.env.REACT_APP_DEV_URL}/get_all_tracks/${lib}`
    })
    const [notFound, setNotFound] = useState(<Loading />)

    const { data: playlists } = useGet(urls.playlists)
    const { data: albums } = useGet(urls.albums)
    const { data: artists } = useGet(urls.artists)
    const { data: tracks } = useGet(urls.tracks)
    
    useEffect(() => {
        setUrls({
            playlists: `${process.env.REACT_APP_DEV_URL}/get_all_playlists/${lib}`,
            albums: `${process.env.REACT_APP_DEV_URL}/get_all_albums/${lib}`,
            artists: `${process.env.REACT_APP_DEV_URL}/get_all_artists/${lib}`,
            tracks: `${process.env.REACT_APP_DEV_URL}/get_all_tracks/${lib}`
        })
    }, [lib])
    
    return (
        <>
            <SearchAndCog setUrl={setUrls} setNotFound={setNotFound} keys={['playlists', 'albums', 'artists', 'tracks']} />
            <div className='musics-carousels'>
                { !playlists && !albums && !artists && !tracks ? notFound : null }
                {playlists && playlists.length > 0 ? (
                    <PlaylistCarousel playlists={playlists} lib={lib} />
                ) : null}
                {albums && albums.length > 0 ? (
                    <AlbumCarousel albums={albums} lib={lib} />
                ) : null}
                {artists && artists.length > 0 ? (
                    <ArtistCarousel artists={artists} lib={lib} />
                ) : null}
                {tracks && tracks.length > 0 ? (
                    <TracksCarousel tracks={tracks} lib={lib} />
                ) : null}
            </div>
        </>
    );
}
