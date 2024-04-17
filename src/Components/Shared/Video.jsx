import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { IoPause, IoPlay, IoVolumeMute, IoVolumeHigh, IoVolumeLow, IoVolumeMedium, IoCheckmark } from 'react-icons/io5';
import { MdFullscreen, MdFullscreenExit, MdPictureInPicture, MdPictureInPictureAlt, MdSubtitles, MdSpatialAudioOff } from 'react-icons/md'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { useCast, CastButton } from 'react-castjs'


import Buttons from "../../Components/Shared/Buttons";

export const Video = ({ options, onReady = () => { }, previousURL = null, previousText = "", nextURL = null, nextText = "", periodsToSkip = null }) => {
  const navigate = useNavigate();

  const auth = { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }


  const { chromecast } = useCast()

  const player = useRef(null);
  const playerContainer = useRef(null);
  const playerControls = useRef(null);

  // Video player states
  // Some states to manage the video player
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Audio player states
  // Some states to manage the audio player
  const [volume, setVolume] = useState(1);

  // Skip button states
  // Some states to manage the skip button
  const [skipButtonVisible, setSkipButtonVisible] = useState(false);
  const [skipButtonText, setSkipButtonText] = useState('Skip Intro');
  const [skipButtonTime, setSkipButtonTime] = useState(0);
  const [skipButtonType, setSkipButtonType] = useState('intro');

  // Video controls states
  // Some states to manage the video controls
  const [timeOfPreviousClick, setTimeOfPreviousClick] = useState(0);// eslint-disable-line no-unused-vars
  const [timeOfPreviousMouseMovement, setTimeOfPreviousMouseMovement] = useState(0);
  const [subtitlesOpen, setSubtitlesOpen] = useState(false);
  const [audioTrackOpen, setAudioTrachOpen] = useState(false);

  // Captions states
  const [captions, setCaptions] = useState([]); // the list of captions objects
  const [selectedCaption, setSelectedCaption] = useState(null); // the full caption object
  const [currentCaption, setCurrentCaption] = useState(null); // the current caption text

  // Audio track states
  const [audioTracks, setAudioTracks] = useState([]); // the list of audio tracks objects
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(null); // the full audio track object



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

  function convertTime(timeString) {
    const timeComponents = timeString.split(':');
    let seconds = 0;

    // Si le temps est au format hh:mm:ss.ms
    if (timeComponents.length === 3) {
      seconds += parseInt(timeComponents[0]) * 3600; // heures en secondes
      seconds += parseInt(timeComponents[1]) * 60;   // minutes en secondes
    } else if (timeComponents.length === 2) { // Si le temps est au format mm:ss.ms
      seconds += parseInt(timeComponents[0]) * 60;   // minutes en secondes
    }

    // Ajoute les secondes et les millisecondes
    const lastComponent = timeComponents[timeComponents.length - 1].split('.');
    seconds += parseInt(lastComponent[0]); // secondes
    if (lastComponent.length > 1) {
      seconds += parseFloat("0." + lastComponent[1]); // millisecondes
    }

    return seconds;
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

  function goToDuration(seconds) {
    player.current.seekTo(seconds);
    setProgress(seconds);
  }

  function goTo(percent) {
    player.current.seekTo(duration * percent);
    setProgress(duration * percent);
  }

  function checkSkipButton() {
    let currentTime = progress;
    const typeToText = {
      'intro': 'Skip Intro',
      'outro': 'Skip Outro',
      'recap': 'Skip Recap'
    }
    if (periodsToSkip == null || periodsToSkip.length === 0) return;
    for (let i = 0; i < periodsToSkip.length; i++) {
      let start_time = parseFloat(periodsToSkip[i].start_time);
      let end_time = parseFloat(periodsToSkip[i].end_time);
      let type = periodsToSkip[i].type;
      if (currentTime >= Math.max(start_time - 5, 0) && currentTime <= end_time - 1) {
        setSkipButtonType(type);
        setSkipButtonVisible(true);
        setSkipButtonText(typeToText[periodsToSkip[i].type]);
        setSkipButtonTime(end_time);
        return;
      }
    }
    setSkipButtonVisible(false);
  }


  useEffect(() => {
    const handleKeyDown = (e) => {
      let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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

  const handleVideoStream = (duration) => {
    //remove duplication in captions
    setCaptions(prevCaptions => [...new Set(prevCaptions.map(JSON.stringify))].map(JSON.parse));
    setProgress(duration);
    checkSkipButton();


    if (selectedAudioTrack == null) {
      setSelectedAudioTrack(audioTracks[0]);
    }
    console.log(selectedAudioTrack)

    if (!selectedCaption) return;

    let currentTime = duration;
    let segments = selectedCaption.segments;
    for (let i = 0; i < segments.length; i++) {
      let start = convertTime(segments[i].start);
      let end = convertTime(segments[i].end);
      let text = segments[i].text;
      if (currentTime >= start && currentTime <= end) {
        setCurrentCaption(text);
        return;
      } else if (currentTime < start) {
        setCurrentCaption(null);
        return;
      }
    }
    setCurrentCaption(null);
  }

  useEffect(() => {
    const fetchVolume = () => {
      const volume = parseFloat(localStorage.getItem('volume'));
      if (!isNaN(volume)) {
        setVolume(volume);
        handleVolumeChange({ target: { value: volume } });
      }
    };

    const fetchSubtitlesAndAudio = async () => {
      try {
        const video_url = options.sources[0].src;
        const parent_url = video_url.split('/').slice(0, -2).join('/');
        const response = await fetch(video_url, auth);
        const data = await response.text();
        const m3u8_file = data.split('\n');

        for (let index in m3u8_file) {
          const line = m3u8_file[index];
          if (line.includes('#EXT-X-MEDIA:TYPE=SUBTITLES')) {
            const caption_data = {};
            caption_data['id'] = line.split('URI="')[1].split('"')[0].split("_")[2].split('.')[0];
            caption_data['name'] = line.split('NAME="')[1].split('"')[0];
            caption_data['language'] = line.split('LANGUAGE="')[1].split('"')[0];
            caption_data['segments'] = [];
            const args = line.split(',');
            const uri = parent_url + args[5].split('"')[1];
            const response = await fetch(uri, auth);
            const vtt_data = await response.text();
            const vtt_file = vtt_data.split('\n')[vtt_data.split('\n').length - 3];
            const vtt_uri = parent_url + vtt_file;
            const vtt_response = await fetch(vtt_uri, auth);
            const vtt_text = await vtt_response.text();
            const lines = vtt_text.split('\n');
            let index = 0;
            while (index < lines.length) {
              if (lines[index] === 'WEBVTT') {
                index++;
                continue;
              }
              if (lines[index].includes("-->")) {
                let line_index = index + 1;
                let text = "";
                while (line_index < lines.length && lines[line_index] !== "") {
                  text += lines[line_index] + "\n";
                  line_index++;
                }
                const start = lines[index].split(' --> ')[0];
                const end = lines[index].split(' --> ')[1];
                caption_data['segments'].push({ start: start, end: end, text: text });
                index = line_index;
              }
              index++;
            }

            setCaptions(prevCaptions => [...prevCaptions, caption_data]);
          } else if (line.startsWith('#AUDIO-MEDIA')) {
            console.log(line);
            const audio_data = {};
            audio_data['id'] = line.split('URI="')[1].split('"')[0].split("_")[2].split('.')[0];
            audio_data['name'] = line.split('NAME="')[1].split('"')[0];
            audio_data['language'] = line.split('LANGUAGE="')[1].split('"')[0];
            audio_data['uri'] = parent_url + line.split('URI="')[1].split('"')[0];
            console.log(audio_data);
            setAudioTracks(prevAudioTracks => [...prevAudioTracks, audio_data]);
          }
        }
      } catch (error) {
        console.error('Error fetching subtitles:', error);
      }
    };

    fetchVolume();
    fetchSubtitlesAndAudio();
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

  const handleMouseMovement = () => {
    setTimeOfPreviousMouseMovement(new Date().getTime());
  };

  const handleCaptionSelection = (caption) => {
    if (selectedCaption && caption && selectedCaption.id === caption.id) {
      setSelectedCaption(null);
      setCurrentCaption(null);
      return;
    }
    setSelectedCaption(caption);
    setSubtitlesOpen(false);
  };

  const handleAudioTrackSelection = (audioTrack) => {
    if (selectedAudioTrack && audioTrack && selectedAudioTrack.id === audioTrack.id) {
      setSelectedAudioTrack(null);
      return;
    }
    setSelectedAudioTrack(audioTrack);
    setAudioTrachOpen(false);
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
    console.log('cast init')
    function onAvailable() {
      console.log('available')
    }

    chromecast.on('available', onAvailable)

    chromecast.on('connect', () => {
      console.log('connect')
    })

    chromecast.on('disconnect', () => {
      console.log('disconnect')
    })

    chromecast.on('playing', () => {
      setIsPlaying(true)
      console.log('playing')
    })

    chromecast.on('pause', () => {
      setIsPlaying(false)
      console.log('pause')
    })

    chromecast.on('error', (e) => {
      console.error(e)
    })

    // remove event listeners
    return function cleanup() {
      chromecast.off('connect')
      chromecast.off('disconnect')
      // remove specific listener
      chromecast.off('available', onAvailable)
      chromecast.off('pause')
      chromecast.off('playing')
      chromecast.off('error')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  const handleCast = () => {
    try {
      if (chromecast.available) {
        if (chromecast.connected) {
          chromecast.disconnect()
        }
        chromecast.cast(options.sources[0].src, {
          title: 'Video Title',
        })
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <div onMouseMove={handleMouseMovement}>
      <div className='player-wrapper' ref={playerContainer} data-video-timestamp={player.current ? player.current.getCurrentTime() : 0}>
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
          onProgress={(progress) => { handleVideoStream(progress.playedSeconds); }}
          onClick={handleVideoClick}
          onPause={() => {
            setIsPlaying(false);
          }}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onBuffer={() => {
            setIsLoading(true);
          }}
          onBufferEnd={() => setIsLoading(false)}
          onEnded={() => {
            setIsPlaying(false);
          }}
          config={{
            file: {
              forceHLS: true,
              hlsOptions: {
                xhrSetup: function (xhr, url) {
                  xhr.open("GET", url, true);
                  xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
                },
              },
            }
          }}
        />
        <div className='player-overlay'>
          <div className='player-subtitle'>
            {/<[a-z][\s\S]*>/i.test(currentCaption) ? (
              <p dangerouslySetInnerHTML={{ __html: currentCaption }} />
            ) : (
              <p>{currentCaption}</p>
            )}
          </div>
          <div className='player-loader'>
            {isLoading && <div className="spinner"></div>}
          </div>
          <div className='player-controls' ref={playerControls}>
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
                <input type='range' min='0' max={duration} value={progress} className='video-player-progress video-slider' onChange={(e) => { player.current.seekTo(e.target.value); setProgress(e.target.value) }} />
              </div>
            </div>
            <div className='player-controls-right'>
              <div className='player-time'>
                <span>{formatTime(progress)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className='player-cast'>
                <CastButton onClick={handleCast} />
              </div>
              <div className='player-subtitles-popup' style={{ opacity: audioTrackOpen ? '1' : '0', pointerEvents: audioTrackOpen ? 'all' : 'none' }}>
                {audioTracks.map((audioTrack, index) => {
                  return (
                    <div key={index} className='player-caption' onClick={() => handleAudioTrackSelection(audioTrack)}>
                      {(selectedAudioTrack && selectedAudioTrack.id === audioTrack.id) ? <IoCheckmark className='player-control-icon' /> : <div></div>}
                      <h3>{audioTrack.name}</h3>
                      <div></div>
                    </div>
                  );
                })}
              </div>
              <div className='player-subtitles-selector'>
                <MdSpatialAudioOff className='player-control-icon' onClick={() => setAudioTrachOpen(!audioTrackOpen)} />
              </div>

              <div className='player-subtitles-popup' style={{ opacity: subtitlesOpen ? '1' : '0', pointerEvents: subtitlesOpen ? 'all' : 'none' }}>
                {captions.map((caption, index) => {
                  return (
                    <div key={index} className='player-caption' onClick={() => handleCaptionSelection(caption)}>
                      {(selectedCaption && selectedCaption.id === caption.id) ? <IoCheckmark className='player-control-icon' /> : <div></div>}
                      <h3>{caption.name}</h3>
                      <div></div>
                    </div>
                  );
                })}
              </div>
              <div className='player-subtitles-selector'>
                <MdSubtitles className='player-control-icon' onClick={() => setSubtitlesOpen(!subtitlesOpen)} />
              </div>
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
            {/* Previous button */}
            {(skipButtonVisible && previousURL !== null) ? <Buttons text={previousText} onClick={() => navigate(previousURL)} /> : <div></div>}

            {/* Skip button */}
            {(skipButtonVisible && nextURL !== null && skipButtonType === 'outro') ? <Buttons text={nextText} onClick={() => navigate(nextURL)} /> :
              (skipButtonVisible && nextURL !== null && skipButtonType !== 'outro') ? <Buttons text={skipButtonText} onClick={() => goToDuration(skipButtonTime - 1)} /> : <div></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
