import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import "video.js/dist/video-js.css";

export const Video = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    const userId = localStorage.getItem('token');

    if (!playerRef.current) {
      const videoElement = document.createElement("video");
      videoElement.classList.add("video-js");
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log("Player is ready");
        onReady && onReady(player);
      });

      // Intercepter les requêtes de chargement de chunk
      videojs.Vhs.xhr.beforeRequest = function (options) {
        options.headers = {
          ...options.headers,
          'x-user-token': userId,
        };
        return options;
      }
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef, onReady]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default Video;
