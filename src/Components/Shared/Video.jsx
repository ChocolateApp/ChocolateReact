import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { IoPause, IoPlay, IoVolumeMute, IoVolumeHigh, IoVolumeLow, IoVolumeMedium } from 'react-icons/io5';
import { MdFullscreen, MdFullscreenExit, MdPictureInPicture, MdPictureInPictureAlt, MdSubtitles } from 'react-icons/md'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';

import Buttons from "../../Components/Shared/Buttons";

export const Video = (props) => {
  const { options, onReady, previousURL, previousText, nextURL, nextText } = props;

  const navigate = useNavigate();

  const player = useRef(null);
  const playerContainer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeOfPreviousClick, setTimeOfPreviousClick] = useState(0);


  const [volumeIcon, setVolumeIcon] = useState(<IoVolumeHigh className="video-player-volume-icon player-control-icon" />);
  const [volumeHovered, setVolumeHovered] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours().toString().padStart(2, "0");
    const mm = date.getUTCMinutes().toString().padStart(2, "0");
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm}:${ss}`;
    } else if (mm) {
      return `00:${mm}:${ss}`;
    } else {
      return `00:00:${ss}`;
    }
  }

  function handleVolumeChange(e) {
    if (e.target.value < 0.01) {
      localStorage.setItem('volume', 0);
      setVolume(0);
      return;
    } else if (e.target.value > 1) {
      localStorage.setItem('volume', 1);
      setVolume(1);
      return;
    }
    localStorage.setItem('volume', e.target.value);
    setVolume(e.target.value);
    if (isMuted) {
      setVolumeIcon(<IoVolumeMute className="audio-player-volume-icon player-control-icon" />);
      return;
    }
    if (e.target.value === 0) {
      setVolumeIcon(<IoVolumeMute className="audio-player-volume-icon player-control-icon" />);
    } else if (e.target.value > 0 && e.target.value <= 0.33) {
      setVolumeIcon(<IoVolumeLow className="audio-player-volume-icon player-control-icon" />);
    } else if (e.target.value > 0.33 && e.target.value <= 0.66) {
      setVolumeIcon(<IoVolumeMedium className="audio-player-volume-icon player-control-icon" />);
    } else if (e.target.value > 0.66) {
      setVolumeIcon(<IoVolumeHigh className="audio-player-volume-icon player-control-icon" />);
    }
  }


  const handleHoverVolume = () => {
    setVolumeHovered(true);
  };

  const handleLeaveVolume = () => {
    setVolumeHovered(false);
  };

  function skip(seconds) {
    player.current.seekTo(progress + seconds);
    setProgress(progress + seconds);
  }


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skip(10);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skip(-10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange({ target: { value: volume + 0.1 } });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange({ target: { value: volume - 0.1 } });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [volume, progress]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = () => {
    setIsMuted(!isMuted);
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (isFullscreen) {
      try {
        document.exitFullscreen()
      } catch (e) {
        //do nothing
      }
    } else {
      playerContainer.current.requestFullscreen();
    }
  }


  useEffect(() => {
    let volume = localStorage.getItem('volume');
    if (volume) {
      volume = parseFloat(volume);
      setVolume(volume);
      handleVolumeChange({ target: { value: volume } });
    }
    setIsPlaying(true);
    setIsPlaying(false);
    setIsPlaying(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVideoClick = () => {
    setTimeOfPreviousClick(prevTime => {
      const currentTime = new Date().getTime();
      if (currentTime - prevTime < 300) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsPlaying(true);
          setIsFullscreen(false);
        } else {
          try {
            playerContainer.current.requestFullscreen();
            setIsFullscreen(true);
          } catch (e) {
            setIsPlaying(true);
          }
        }
        setIsPlaying(true);
      } else {
        togglePlayPause();
      }
      return currentTime;
    });
  };

  return (
    <>
      <div className='player-wrapper' ref={playerContainer}>
        <ReactPlayer
          ref={player}
          url={options.sources[0].src}
          controls={false}
          width='100%'
          height='100dvh'
          style={{ backgroundColor: 'black' }}
          muted={isMuted}
          volume={volume}
          playing={isPlaying}
          onReady={onReady}
          pip={pip}
          stopOnUnmount={false}
          onEnablePIP={() => setPip(true)}
          onDisablePIP={() => setPip(false)}
          onDuration={(duration) => setDuration(duration)}
          onProgress={(progress) => { setProgress(progress.playedSeconds); }}
          onClick={handleVideoClick}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onBuffer={() => setIsLoading(true)}
          onBufferEnd={() => setIsLoading(false)}
          onEnded={() => setIsPlaying(false)}
          config={{
            file: {
              forceHLS: true,
              hlsOptions: {
                xhrSetup: function (xhr, url) {
                  xhr.open("GET", url, true);
                  xhr.setRequestHeader(
                    "Authorization",
                    `Bearer ${localStorage.getItem('token')}`
                  );
                },
              },
            }
          }}
        />
        <div className='player-overlay'>
          <div className='player-subtitle'></div>
          <div className='player-loader'>
            {isLoading && <div className="spinner"></div>}
          </div>
          <div className='player-controls'>
            <div className='player-controls-left'>
              {isPlaying ? (
                <IoPause
                  className='player-control-icon'
                  onClick={togglePlayPause}
                />
              ) : (
                <IoPlay
                  className='player-control-icon'
                  onClick={togglePlayPause}
                />
              )}
              <div className='player-volume'>
                <div onMouseEnter={handleHoverVolume} onMouseLeave={handleLeaveVolume} className="video-player-volume-icon-container" onClick={() => setIsMuted(!isMuted)}>
                  {volumeIcon}
                </div>
                <div className="video-player-volumebar-container icons-container" style={{ opacity: volumeHovered ? 1 : '' }} onMouseEnter={handleHoverVolume} onMouseLeave={handleLeaveVolume}>
                  <input type="range" className="video-player-volumebar video-slider" min={0} max={1} step={0.001} value={volume} onChange={handleVolumeChange} />
                </div>
              </div>
            </div>
            <div className='player-controls-center'>
              <div className='player-progress'>
                <input type='range' min='0' max={duration} value={progress} className='video-player-progress video-slider' onChange={(e) => player.current.seekTo(e.target.value)} />
              </div>
            </div>
            <div className='player-controls-right'>
              <div className='player-time'>
                <span>{formatTime(progress)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
              {/*
              <div className='player-subtitles-popup' style={{ opacity: subtitlesOpen ? '1' : '0', pointerEvents: subtitlesOpen ? 'all' : 'none' }}>
                <p>Test</p>
                <p>Test</p>
                <p>Test</p>
              </div>
              <div className='player-subtitles-selector'>
                <MdSubtitles className='player-control-icon' onClick={() => setSubtitlesOpen(!subtitlesOpen)} />
              </div>
              */}
              <div className='player-pip'>
                {pip ? (
                  <MdPictureInPicture
                    className='player-control-icon'
                    onClick={() => setPip(false)}
                  />
                ) : (
                  <MdPictureInPictureAlt
                    className='player-control-icon'
                    onClick={() => setPip(true)}
                  />
                )}
              </div>
              <div className='player-fullscreen'>
                {isFullscreen ? (
                  <MdFullscreenExit
                    className='player-control-icon'
                    onClick={() => toggleFullscreen()}
                  />
                ) : (
                  <MdFullscreen
                    className='player-control-icon'
                    onClick={() => toggleFullscreen()}
                  />
                )}
              </div>
            </div>
          </div>

          <div className='player-buttons'>
            {!previousURL.endsWith("/null") && <Buttons text={previousText} onClick={() => navigate(previousURL)} />}
            {previousURL.endsWith("/null") && <div></div>}
            {!nextURL.endsWith("/null") && <Buttons text={nextText} onClick={() => navigate(nextURL)} />}
            {nextURL.endsWith("/null") && <div></div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
