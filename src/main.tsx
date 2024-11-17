import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import Login from '@/Pages/Auth/Login.tsx';
import Logout from '@/Pages/Auth/Logout.tsx';
import Invite from '@/Pages/Invite/Invite.tsx';

import Home from '@/Pages/Home/Home';

import Movies from '@/Pages/Movies/Movies.tsx';
import Shows from '@/Pages/Shows/Shows.tsx';

import VideoMedia from '@/Pages/Watch/VideoMedia.tsx';

import LayoutHeader from '@/Layouts/LayoutHeader';

import { SearchProvider } from '@/Contexts/SearchContext.tsx';
//import TV from './Pages/TV/TV';
import Settings from './Pages/Settings/Settings';
import Profil from './Pages/Profil/Profil';

import NotFoundPage from './Pages/Errors/404';


const RenderWatch = () => {
  const { type } = useParams<{ type: string }>();

  const video_medias = ["movie", "show", "live-tv", "other"];

  return (
    type && video_medias.includes(type) ? (
      <VideoMedia />
    ) : (
      <Navigate to="/home" />
    )
  )
}


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/invite",
    element: <Invite />,
  },
  {
    path: "/",
    element: <LayoutHeader />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/shows",
        element: <Shows />,
      },
      // {
      //   path: "/live-tv",
      //   element: <TV />,
      // },
      {
        path: "/watch/:type/:id",
        element: <RenderWatch />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/profil",
        element: <Profil />,
      },
    ],
  },
  {
    path: "*",
    element: <LayoutHeader />,
    children: [
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <>
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
    <ToastContainer theme='colored' position='bottom-right' />
  </>
);
