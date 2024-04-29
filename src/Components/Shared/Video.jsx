import React, { useEffect, useRef, useState } from 'react';
import { IoPause, IoPlay, IoVolumeMute, IoVolumeHigh, IoVolumeLow, IoVolumeMedium, IoCheckmark, IoSettingsSharp } from 'react-icons/io5';
import { MdFullscreen, MdFullscreenExit, MdPictureInPicture, MdPictureInPictureAlt, MdSubtitles, MdSpatialAudioOff, MdOutlineCast } from 'react-icons/md'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { useCast, useEventListener } from '@jdion/cast-react';
import useTrait from '../../Utils/useTrait';

import Hls from "hls.js";

import Buttons from "../../Components/Shared/Buttons";


export const Video = ({ options }) => {
  const navigate = useNavigate();
  const { player: chromecastPlayer } = useCast()

  useEventListener('castStateChanged')
  useEventListener('playerStateChanged')


  const player = useRef(null);
  const playerContainer = useRef(null);
  const playerControls = useRef(null);

  // Video player states
  // Some states to manage the video player
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [HLS, setHLS] = useState(null);

  // Audio player states
  // Some states to manage the audio player
  const [volume, setVolume] = useState(1);

  // Skip button states
  // Some states to manage the skip button
  const [skipRecurrent, setSkipRecurrent] = useState(false); // eslint-disable-line no-unused-vars
  const [skipButtonText, setSkipButtonText] = useState('Skip Intro');
  const [skipButtonTime, setSkipButtonTime] = useState(0);
  const [skipButtonType, setSkipButtonType] = useState('outro');

  // Video controls states
  // Some states to manage the video controls
  const [timeOfPreviousMouseMovement, setTimeOfPreviousMouseMovement] = useState(0);
  const [subtitlesOpen, setSubtitlesOpen] = useState(false);
  const [audioTrackOpen, setAudioTrackOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);

  // Captions states
  const captions = useTrait([]); // the list of captions objects
  const [selectedCaption, setSelectedCaption] = useState(null); // the full caption object

  // Audio track states
  const audioTracks = useTrait([]); // the list of audio tracks objects
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(null); // the audio track id

  // Quality states
  const qualities = useTrait([]); // the list of qualities objects
  const [selectedQuality, setSelectedQuality] = useState(null); // the quality id


  const [volumeIcon, setVolumeIcon] = useState(<IoVolumeHigh className="video-player-volume-icon player-control-icon" />);
  const [volumeHovered, setVolumeHovered] = useState(false);

  const togglePlayPause = (e) => {
    e && e.stopPropagation();
    e && e.preventDefault();
    if (player.current.paused) {
      player.current.play();
    } else {
      player.current.pause();
    }
  }

  function formatTime(seconds) {

    const date = new Date(seconds * 1000);
    let hh = date.getUTCHours().toString().padStart(2, "0");
    let mm = date.getUTCMinutes().toString().padStart(2, "0");
    let ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (isNaN(hh)) hh = "00";
    if (isNaN(mm)) mm = "00";
    if (isNaN(ss)) ss = "00";

    if (hh) {
      return `${hh}:${mm}:${ss}`;
    } else if (mm) {
      return `00:${mm}:${ss}`;
    } else {
      return `00:00:${ss}`;
    }
  }

  function handleVolumeChange(e) {
    setIsMuted(false);
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
    if (e.target.value === 0) {
      setVolumeIcon(<IoVolumeMute className="audio-player-volume-icon player-control-icon" />);
    } else if (e.target.value > 0 && e.target.value <= 0.33) {
      setVolumeIcon(<IoVolumeLow className="audio-player-volume-icon player-control-icon" />);
    } else if (e.target.value > 0.33 && e.target.value <= 0.66) {
      setVolumeIcon(<IoVolumeMedium className="audio-player-volume-icon player-control-icon" />);
    } else if (e.target.value > 0.66) {
      setVolumeIcon(<IoVolumeHigh className="audio-player-volume-icon player-control-icon" />);
    }
    player.current.volume = e.target.value;
  }


  const handleHoverVolume = () => {
    setVolumeHovered(true);
  };

  const handleLeaveVolume = () => {
    setVolumeHovered(false);
  };

  function skip(seconds) {
    seekTo(player.current.currentTime + seconds);
  }

  function goToDuration(seconds) {
    seekTo(seconds);
  }

  function goTo(percent) {
    seekTo(player.current.duration * percent);
  }

  function checkSkipButton() {
    let currentTime = progress;
    const typeToText = {
      'intro': 'Skip Intro',
      'outro': 'Skip Outro',
      'recap': 'Skip Recap',
    }
    if (options.periods_to_skip == null || options.periods_to_skip.length === 0) return;
    for (let i = 0; i < options.periods_to_skip.length; i++) {
      let start_time = parseFloat(options.periods_to_skip[i].start_time);
      let end_time = parseFloat(options.periods_to_skip[i].end_time);
      let type = options.periods_to_skip[i].type;
      if (currentTime >= Math.max(start_time - 5, 0) && currentTime <= end_time - 1) {
        setSkipButtonType(type);
        setSkipButtonText(typeToText[options.periods_to_skip[i].type]);
        setSkipButtonTime(end_time);
        return;
      }
    }

  }


  useEffect(() => {
    const handleKeyDown = (e) => {
      let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'c') {
        if (captions.length > 0 && HLS) {
          e.preventDefault();
          if (selectedCaption === null) {
            setSelectedCaption(captions[0]);
            HLS.subtitleTrack = captions[0].id;
            HLS.subtitleDisplay = true;
          } else {
            setSelectedCaption(null);
            HLS.subtitleTrack = -1;
            HLS.subtitleDisplay = false;
          }
        }
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
      } else if (numbers.includes(e.key)) {
        e.preventDefault();
        goTo(parseInt(e.key) / 10);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [volume, progress]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      player.current.volume = volume;
      setVolumeIcon(<IoVolumeHigh className="audio-player-volume-icon player-control-icon" />);
    } else {
      player.current.volume = 0;
      setVolumeIcon(<IoVolumeMute className="audio-player-volume-icon player-control-icon" />);
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (isFullscreen) {
      try {
        document.exitFullscreen()
      } catch (e) {
      }
    } else {
      playerContainer.current.requestFullscreen();
    }
  }

  const handleVideoStream = () => {
    if (!audioTracks.get() || !captions.get() || !qualities.get()) return;
    if (audioTracks.get().length > 0) return;
    if (captions.get().length > 0) return;
    if (qualities.get().length > 0) return;

    if (HLS && qualities.get().length === 0) {
      let levels = HLS.levels;
      for (let i = 0; i < levels.length; i++) {
        let qualityObject = {
          id: i,
          height: levels[i].height + 'p',
          bitrate: levels[i].bitrate,
        };
        let old_qualities = [...qualities.get(), qualityObject];
        qualities.set(old_qualities);
      }
    }


    if (HLS && captions.get().length === 0) {
      let subtitleTracks = HLS.allSubtitleTracks;
      for (let i = 0; i < subtitleTracks.length; i++) {
        let subtitleObject = {
          id: subtitleTracks[i].id,
          name: subtitleTracks[i].name,
          language: subtitleTracks[i].lang,
        };
        let old_captions = [...captions.get(), subtitleObject];
        captions.set(old_captions);
      }
    }

    if (HLS && audioTracks.get().length === 0) {
      let HLSaudioTracks = HLS.audioTracks;
      for (let i = 0; i < HLSaudioTracks.length; i++) {
        let audioTrackObject = {
          id: HLSaudioTracks[i].id,
          name: HLSaudioTracks[i].name,
          language: HLSaudioTracks[i].lang,
        };
        let old_audio_tracks = [...audioTracks.get(), audioTrackObject];
        audioTracks.set(old_audio_tracks);
      }

    }

    if (HLS && selectedAudioTrack === null) {
      setSelectedAudioTrack(HLS.audioTrack);
    }


    setProgress(player.current.currentTime);
    checkSkipButton();
  }

  useEffect(() => {
    audioTracks.set([]);
    captions.set([]);
    qualities.set([]);
    setSelectedAudioTrack(null);
    setSelectedCaption(null);
    setSelectedQuality(null);


    if (player.current) {
      const video = player.current;
      if (video) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            xhrSetup: function (xhr, url) {
              xhr.open("GET", url, true);
              xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
            }
          });
          hls.loadSource(options.sources[0].src);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
          });

          video.addEventListener('timeupdate', () => {
            handleVideoStream(video.currentTime);
          });

          setHLS(hls);


        } else {
          video.src = options.sources[0].src;
        }
      }
    }
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseMovement = () => {
    setTimeOfPreviousMouseMovement(new Date().getTime());
  };

  const handleCaptionOpen = () => {
    setSubtitlesOpen(!subtitlesOpen);
    setAudioTrackOpen(false);
    setQualityOpen(false);
  };

  const handleAudioTracksOpen = () => {
    setAudioTrackOpen(!audioTrackOpen);
    setSubtitlesOpen(false);
    setQualityOpen(false);
  };

  const handleQualityOpen = () => {
    setQualityOpen(!qualityOpen);
    setSubtitlesOpen(false);
    setAudioTrackOpen(false);
  };

  const handleCaptionSelection = (caption) => {
    if (selectedCaption && caption && selectedCaption.id === caption.id) {
      setSelectedCaption(null);
      HLS.subtitleTrack = -1;
      HLS.subtitleDisplay = false;
      return;
    }
    setSelectedCaption(caption);
    setSubtitlesOpen(false);
    HLS.subtitleTrack = caption.id;
    HLS.subtitleDisplay = true;
  };

  const handleAudioTrackSelection = (audioTrack) => {
    if (selectedAudioTrack && audioTrack && selectedAudioTrack === audioTrack.id) {
      let HLSaudioTracks = HLS.audioTracks;
      setSelectedAudioTrack(HLSaudioTracks[0].id);
      HLS.audioTrack = HLSaudioTracks[0].id;
      return;
    }
    setSelectedAudioTrack(audioTrack.id);
    HLS.audioTrack = audioTrack.id;
    setAudioTrackOpen(false);
  };

  const handleQualitySelection = (quality) => {
    if (!quality) {
      setSelectedQuality(null);
      HLS.currentLevel = -1;
      return;
    }
    if (selectedQuality && quality && selectedQuality === quality.id) {
      setSelectedQuality(null);
      HLS.currentLevel = -1;
      return;
    }
    setSelectedQuality(quality.id);
    HLS.currentLevel = quality.id;
    setQualityOpen(false);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (new Date().getTime() - timeOfPreviousMouseMovement > 5000) {
        if (playerControls.current.classList.contains('disabled')) return;
        playerControls.current.classList.add('disabled');
        setSubtitlesOpen(false);
        playerContainer.current.classList.add('cursor-none')
      } else {
        playerControls.current.classList.remove('disabled');
        playerContainer.current.classList.remove('cursor-none')
      }
    });
    return () => clearInterval(interval);
  })

  useEffect(() => {
  }, []);

  const handleCast = async () => {
    console.log('casting');
    console.log(options);
    chromecastPlayer.state.displayName = 'Chocolate'
    chromecastPlayer.state.title = options.title ?? 'Video';
    chromecastPlayer.state.imageUrl = options.cover;

    chromecastPlayer.startCast(options.sources[0].src, 'application/vnd.apple.mpegurl');
    console.log(chromecastPlayer);
  }

  const handlePip = () => {
    if (document.pictureInPictureEnabled && document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      player.current.requestPictureInPicture();
    }
  }

  const seekTo = (time) => {
    player.current.currentTime = parseFloat(time);
    setProgress(time);
  }

  const handleProgressBarChange = (e) => {
    seekTo(e.target.value);
  }

  const handleVolumeClick = (e) => {
    if (isMuted) {
      setIsMuted(false);
      player.current.volume = volume;
      handleVolumeChange({ target: { value: volume } });
    } else {
      setVolumeIcon(<IoVolumeMute className="audio-player-volume-icon player-control-icon" />);
      setIsMuted(true);
      player.current.volume = 0;
    }
  }

  const handleEpisodeChange = (episode) => {
    navigate(episode);
  }


  return (
    <div onMouseMove={handleMouseMovement}>
      <div className='player-wrapper' ref={playerContainer} >
        <video
          style={{ backgroundColor: 'black', width: '100%', height: '100dvh' }}
          ref={player}
          onProgress={handleVideoStream}
          onClick={togglePlayPause}
        />
        <div className='player-overlay'>
          <div className='player-loader'>
            {player.current && player.current.readyState < 4 ? <div className="spinner"></div> : null}
          </div>
          <div className='player-controls' ref={playerControls}>
            <div className='player-controls-left'>
              {player.current && player.current.paused ? (
                <IoPlay
                  className='player-control-icon'
                  onClick={togglePlayPause}
                />
              ) : (
                <IoPause
                  className='player-control-icon'
                  onClick={togglePlayPause}
                />
              )}
              <div className='player-volume'>
                <div onMouseEnter={handleHoverVolume} onMouseLeave={handleLeaveVolume} className="video-player-volume-icon-container" onClick={handleVolumeClick}>
                  {volumeIcon}
                </div>
                <div className="video-player-volumebar-container icons-container" style={{ opacity: volumeHovered ? 1 : '' }} onMouseEnter={handleHoverVolume} onMouseLeave={handleLeaveVolume}>
                  <input type="range" className="video-player-volumebar video-slider" min={0} max={1} step={0.001} value={volume} onChange={handleVolumeChange} />
                </div>
              </div>
            </div>
            <div className='player-controls-center'>
              <div className='player-progress'>
                <input type='range' min='0' max={player.current ? (player.current.duration ?? 0) : 0} value={progress} className='video-player-progress video-slider' onChange={handleProgressBarChange} />
              </div>
            </div>
            <div className='player-controls-right'>
              <div className='player-time'>
                <span>{formatTime(progress)}</span>
                <span>/</span>
                <span>{formatTime(player.current ? player.current.duration : 0)}</span>
              </div>
              {/*
              <div className='player-cast'>
                <MdOutlineCast className='player-control-icon' onClick={handleCast} />
              </div>
              */}
              <div className='player-subtitles-popup' style={{ opacity: qualityOpen ? '1' : '0', pointerEvents: qualityOpen ? 'all' : 'none' }}>
                <div className='player-caption' onClick={() => handleQualitySelection(null)}>
                  {(selectedQuality === null) ? <IoCheckmark className='player-control-icon' /> : <div></div>}
                  <h3>Auto</h3>
                  <div></div>
                </div>
                {qualities.get().map((audioTrack, index) => {
                  return (
                    <div key={index} className='player-caption' onClick={() => handleQualitySelection(audioTrack)}>
                      {(selectedQuality && selectedQuality === audioTrack.id) ? <IoCheckmark className='player-control-icon' /> : <div></div>}
                      <h3>{audioTrack.height}</h3>
                      <div></div>
                    </div>
                  );
                })}
              </div>
              {qualities.get() && qualities.get().length > 0 ?
                <div className='player-subtitles-selector'>
                  <IoSettingsSharp className='player-control-icon' onClick={handleQualityOpen} />
                </div>
                : null
              }
              <div className='player-subtitles-popup' style={{ opacity: audioTrackOpen ? '1' : '0', pointerEvents: audioTrackOpen ? 'all' : 'none' }}>
                {audioTracks.get().map((audioTrack, index) => {
                  return (
                    <div key={index} className='player-caption' onClick={() => handleAudioTrackSelection(audioTrack)}>
                      {(selectedAudioTrack && selectedAudioTrack === audioTrack.id) ? <IoCheckmark className='player-control-icon' /> : <div></div>}
                      <h3>{audioTrack.name}</h3>
                      <div></div>
                    </div>
                  );
                })}
              </div>
              {audioTracks.get() && audioTracks.get().length > 0 ?
                <div className='player-subtitles-selector'>
                  <MdSpatialAudioOff className='player-control-icon' onClick={handleAudioTracksOpen} />
                </div>
                : null
              }

              <div className='player-subtitles-popup' style={{ opacity: subtitlesOpen ? '1' : '0', pointerEvents: subtitlesOpen ? 'all' : 'none' }}>
                {captions.get().map((caption, index) => {
                  return (
                    <div key={index} className='player-caption' onClick={() => handleCaptionSelection(caption)}>
                      {(selectedCaption && selectedCaption.id === caption.id) ? <IoCheckmark className='player-control-icon' /> : <div></div>}
                      <h3>{caption.name}</h3>
                      <div></div>
                    </div>
                  );
                })}
              </div>
              {captions.get() && captions.get().length > 0 ?
                <div className='player-subtitles-selector'>
                  <MdSubtitles className='player-control-icon' onClick={handleCaptionOpen} />
                </div>
                : null
              }
              <div className='player-pip'>
                {document.pictureInPictureEnabled && document.pictureInPictureElement ? (
                  <MdPictureInPicture
                    className='player-control-icon'
                    onClick={handlePip}
                  />
                ) : (
                  <MdPictureInPictureAlt
                    className='player-control-icon'
                    onClick={handlePip}
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
            {/* Previous button */}
            {(options.previous_episode !== null) ? <Buttons text={options.previous_text} onClick={() => handleEpisodeChange(options.previous_episode)} /> : <div></div>}

            {/* Skip button */}
            {(options.next_episode !== null && skipButtonType === 'outro') ? <Buttons text={options.next_text} onClick={() => handleEpisodeChange(options.next_episode)} /> : (
              (options.next_episode !== null && skipButtonType !== 'outro') ? <Buttons text={skipButtonText} onClick={() => goToDuration(skipButtonTime - 1)} /> : <div></div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
