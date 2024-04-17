import React, { useEffect } from 'react';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';

import { ReactNotifications } from 'react-notifications-component';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { create } from 'zustand';

import { CastProvider } from 'react-castjs'

import { usePost, useGet } from './Utils/Fetch';

import Home from './Pages/Home';

import Movies from './Pages/Movies';
import Series from './Pages/Series';
import Books from './Pages/Books';
import Others from './Pages/Others';
import TVs from './Pages/TVs';
import Consoles from './Pages/Consoles';
import Musics from './Pages/Musics';

import EditMovie from './Pages/EditMovie';
import EditSerie from './Pages/EditSerie';

import Season from './Pages/Season';
import Console from './Pages/Console';

import Album from './Pages/Album';
import Playlist from './Pages/Playlist';
import Artist from './Pages/Artist';

import Movie from './Pages/Movie';
import Episode from './Pages/Episode';
import Other from './Pages/Other';
import Book from './Pages/Book';
import Channel from './Pages/Channel';
import Game from './Pages/Game';

import AudioPlayer from './Components/Shared/AudioPlayer';
import Header from './Components/Shared/Header';

import Actor from './Pages/Actor';

import AddMedia from './Pages/AddMedia';

import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Settings from './Pages/Settings';
import Profil from './Pages/Profil';
import CreateAccount from './Pages/CreateAccount';

import "./App.css";

const useAudioPlayerStore = create((set) => ({
  visible: false,
  setVisible: (visible) => set({ visible }),
  isOpened: false,
  setIsOpened: (isOpened) => set({ isOpened }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  isMuted: false,
  setIsMuted: (isMuted) => set({ isMuted }),
  mute: () => set((state) => ({ isMuted: !state.isMuted })),
  volume: 0.5,
  setVolume: (volume) => set({ volume }),
  sources: [],
  setSources: (sources) => set({ sources }),
  sourceIndex: 0,
  setSourceIndex: (sourceIndex) => set({ sourceIndex }),
}));

function LanguageFile() {
  const { data: language } = useGet(`${process.env.REACT_APP_DEV_URL}/language_file`);
  localStorage.setItem('language', JSON.stringify(language));
  return null;
}

function CheckLogin() {
  const { handleSubmit, resMsg } = usePost();
  const location = useLocation();
  const pathname = location.pathname.split('/')[1];

  useEffect(() => {
    handleSubmit({
      url: `${process.env.REACT_APP_DEV_URL}/check_login`,
      body: {
        token: localStorage.getItem('token'),
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (resMsg !== null) {
      if (resMsg.status === 'ok') {
        let username = resMsg.username;
        let account_type = resMsg.account_type;
        let id = resMsg.account_id;

        localStorage.setItem('username', username);
        localStorage.setItem('account_type', account_type);
        localStorage.setItem('id', id);
      } else {
        localStorage.removeItem('token');
        window.location.reload();
      }
    }
  }, [resMsg, pathname]);

  return null;
}

const App = () => {
  useEffect(() => {
    AOS.init();
  }, []);


  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:lib" element={<Movies />} />
          <Route path="/series/:lib" element={<Series />} />
          <Route path="/season/:id" element={<Season />} />
          <Route path="/books/:lib" element={<Books />} />
          <Route path="/others/:lib" element={<Others />} />
          <Route path="/tv/:lib" element={<TVs />} />
          <Route path="/consoles/:lib" element={<Consoles />} />
          <Route path="/musics/:lib" element={<Musics />} />
          <Route path="/edit_movie/:id/:lib" element={<EditMovie />} />
          <Route path="/edit_serie/:id/:lib" element={<EditSerie />} />
          <Route path="/console/:lib/:console" element={<Console />} />
          <Route path="/album/:lib/:id" element={<Album />} />
          <Route path="/playlist/:lib/:id" element={<Playlist />} />
          <Route path="/artist/:lib/:id" element={<Artist />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/episode/:id" element={<Episode />} />
          <Route path="/other/:id" element={<Other />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/channel/:lib/:id" element={<Channel />} />
          <Route path="/game/:lib/:console/:id" element={<Game />} />
          <Route path="/actor/:id" element={<Actor />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/add_media" element={<AddMedia />} />
          <Route path="/login" element={<Login />} no_login={true} />
          <Route path="/invite/:key" element={<CreateAccount />} no_login={true} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export const Layout = ({ children }) => {

  const isAuthenticated = localStorage.getItem('token') !== null
  const location = useLocation();
  const pathname = "/" + location.pathname.split('/')[1];
  let no_login = false

  for (let i = 0; i < children.props.children.length; i++) {
    const child_path = "/" + children.props.children[i].props.path.split('/')[1]
    if (child_path === pathname) {
      no_login = children.props.children[i].props.no_login || false
      break;
    }
  }

  return (
    <>
      <CastProvider>
        <LanguageFile />
        <ReactNotifications />
        {isAuthenticated && !no_login ? (
          <>
            <AudioPlayer store={useAudioPlayerStore} />
            <Header />
            <CheckLogin />
            {children}
          </>
        ) : no_login ? (
          <>
            {children}
          </>
        ) : (
          <>
            <Login />
          </>
        )
        }
      </CastProvider>
    </>
  );
};

export default App;

export { useAudioPlayerStore };
