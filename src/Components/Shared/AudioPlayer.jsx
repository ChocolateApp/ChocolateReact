import { useAudioPlayerStore } from '../../App'
import { useEffect, useRef, useState, useCallback } from 'react';

import { usePost } from '../../Utils/Fetch';

import { IoPlayOutline, IoPauseOutline, IoPlaySkipForwardOutline, IoPlaySkipBackOutline, IoVolumeMuteOutline, IoVolumeLowOutline, IoVolumeMediumOutline, IoVolumeHighOutline, IoRepeatOutline, IoShuffleOutline, IoCloseOutline } from 'react-icons/io5';

const AudioPlayer = () => {
    let { visible, sources, isPlaying, setIsPlaying, sourceIndex, setSourceIndex, setSources, setVisible } = useAudioPlayerStore();

    const audioRef = useRef(null);
    
    const [time, setTime] = useState(0);
    const [repeat, setRepeat] = useState(1);
    const [isShuffled, setIsShuffled] = useState(false);
    const [sourcesSave, setSourcesSave] = useState(null);
    const [volumeHovered, setVolumeHovered] = useState(false);
    const [volumeIcon, setVolumeIcon] = useState(<IoVolumeMediumOutline className="audio-player-volume-icon"/>);
    const [repeatIcon, setRepeatIcon] = useState(<IoRepeatOutline className="audio-player-repeat-icon no-repeat" />);

    const { handleSubmit } = usePost();

    useEffect(() => {
        if (sources.length > 0 && !sourcesSave) {
            setSourcesSave(sources);
        }
    }, [sources, sourcesSave]);

    useEffect(() => {
        const repeatOrder = ["no-repeat", "repeat", "repeat-one"];
        const repeatIcons = {
            "no-repeat": <IoRepeatOutline className="audio-player-repeat-icon no-repeat" />,
            "repeat": <IoRepeatOutline className="audio-player-repeat-icon repeat-active" />,
            "repeat-one": <><IoRepeatOutline className="audio-player-repeat-icon repeat-one" /><span>1</span></>
        }

        setRepeatIcon(repeatIcons[repeatOrder[repeat]]);
    }, [repeat]);

    useEffect(() => {
        if (!sources[sourceIndex]?.id) return;
        let url = `${process.env.REACT_APP_DEV_URL}/play_track/${sources[sourceIndex].id}/${localStorage.getItem('id')}`;
        handleSubmit({
            url: url
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sources, sourceIndex]);
    
    function shuffleList(list) {
        return [...list].sort(() => Math.random() - 0.5);
    }

    const handleShuffle = () => {
        if (isShuffled) {
            setIsShuffled(false);
            setSources(sourcesSave);
        } else {
            setIsShuffled(true);
            setSources(shuffleList(sources));
            setSourceIndex(0);
        }
    }

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, [setIsPlaying]);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, [setIsPlaying]);

    const handleRepeat = () => {
        setRepeat((repeat + 1) % 3);
    }

    const handleNext = useCallback(() => {
        if (sourceIndex < sources.length - 1) {
            setSourceIndex(sourceIndex + 1);
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [sourceIndex, sources, setIsPlaying, setSourceIndex]);

    const handlePrevious = useCallback(() => {
        if (sourceIndex > 0) {
            setSourceIndex(sourceIndex - 1);
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [sourceIndex, setIsPlaying, setSourceIndex]);
    
    const handleTimeUpdate = () => {
        setTime(audioRef.current.currentTime);

        if (audioRef.current.currentTime === audioRef.current.duration) {
            console.log("end");
            console.log(`Repeat: ${repeat}`);
            console.log(`SourceIndex: ${sourceIndex}`);
            console.log(`SourcesLength: ${sources.length}`);
            if (repeat === 0 && sourceIndex === sources.length - 1) {
                setIsPlaying(false);
            } else if (repeat === 0) {
                setSourceIndex(sourceIndex + 1);
            } else if (repeat === 1 && sourceIndex === sources.length - 1) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            } else if (repeat === 1) {
                setSourceIndex((sourceIndex + 1) % sources.length);
            } else if (repeat === 2) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        }
    };

    const handleHoverVolume = () => {
        setVolumeHovered(true);
    };

    const handleLeaveVolume = () => {
        setVolumeHovered(false);
    };


    const handleVolumeChange = (e) => {
        audioRef.current.volume = e.target.value;
        if (e.target.value === 0) {
            setVolumeIcon(<IoVolumeMuteOutline className="audio-player-volume-icon"/>);
        } else if (e.target.value > 0 && e.target.value <= 0.33) {
            setVolumeIcon(<IoVolumeLowOutline className="audio-player-volume-icon"/>);
        } else if (e.target.value > 0.33 && e.target.value <= 0.66) {
            setVolumeIcon(<IoVolumeMediumOutline className="audio-player-volume-icon"/>);
        } else if (e.target.value > 0.66) {
            setVolumeIcon(<IoVolumeHighOutline className="audio-player-volume-icon"/>);
        }
    };

    useEffect(() => {
        const actionHandlers = {
            "play": handlePlay,
            "pause": handlePause,
            "nexttrack": sourceIndex < sources.length-1 ? handleNext : null,
            "previoustrack": sourceIndex > 0 ? handlePrevious : null,
        }

        if (!audioRef.current) return;
        audioRef.current.src = `${process.env.REACT_APP_DEV_URL}/get_track/${sources[sourceIndex]?.id}`;
        audioRef.current.load();
        audioRef.current.play();

        navigator.mediaSession.metadata = new MediaMetadata({
            title: sources[sourceIndex]?.name,
            artist: sources[sourceIndex]?.artist_name,
            album: sources[sourceIndex]?.album_name,
            artwork: [
                { src: `${process.env.REACT_APP_DEV_URL}/${sources[sourceIndex]?.cover}`, sizes: '512x512', type: 'image/png' },
            ]
        });

        for (const [action, handler] of Object.entries(actionHandlers)) {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (error) {
                console.log(`The media session action "${action}" is not supported yet.`);
            }
        }
    }, [sources, sourceIndex, handlePlay, handlePause, handleNext, handlePrevious]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play();
        } else if (!isPlaying) {
            audioRef.current.pause();
        }
    }, [isPlaying]);
    
    function getDuration(duration) {
        let minutes = Math.floor(duration / 60);
        let seconds = Math.round(duration - minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return `${minutes}:${seconds}`;
    }

    useEffect(() => {
        const audioElement = audioRef.current;

        if (!audioElement) return;

        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("play", handlePlay);

        audioElement.addEventListener("pause", handlePause);
        audioElement.addEventListener("play", handlePlay);

        return () => {
            audioElement.removeEventListener("pause", handlePause);
            audioElement.removeEventListener("play", handlePlay);
        };
    }, [audioRef, setIsPlaying, handlePause, handlePlay]);

    return (
        <>
            { visible && (
                <div className="audio-player">
                    <div className="audio-player-buttons">
                        { sourceIndex > 0 ? (
                            <button onClick={handlePrevious} className='audio-player-button'>
                                <IoPlaySkipBackOutline />
                            </button>
                        ) : (
                            <div className='audio-player-button'></div>
                        )}
                        { !isPlaying && (
                        <button onClick={handlePlay} className='audio-player-button'>
                            <IoPlayOutline />
                        </button>
                        )}
                        { isPlaying && (
                        <button onClick={handlePause} className='audio-player-button'>
                            <IoPauseOutline />
                        </button>
                        )}
                        { sourceIndex < sources.length - 1 ? (
                            <button onClick={handleNext} className='audio-player-button'>
                                <IoPlaySkipForwardOutline />
                            </button>
                        ) : (
                            <div className='audio-player-button'></div>
                        )}
                    </div>
                    <div className="audio-player-seek">
                        <h2>{sources[sourceIndex]?.name} • {sources[sourceIndex]?.artist_name}</h2>
                        <div className="audio-seekbar">
                            <h3>{getDuration(time)}</h3>
                            <input type="range" className="audio-player-seekbar audio-slider" min={0} max={audioRef.current?.duration} value={time || 0} onChange={(e) => { audioRef.current.currentTime = e.target.value }} />
                            <h3>{getDuration(audioRef.current?.duration || sources[sourceIndex]?.duration)}</h3>
                        </div>
                    </div>
                    <div className="audio-player-icon-right">
                        <div onMouseEnter={handleHoverVolume} onMouseLeave={handleLeaveVolume} className="audio-player-volume-icon-container" style={{order: 1}}>
                            {volumeIcon}
                        </div>
                        <div className="audio-player-volumebar-container icons-container" style={{opacity: volumeHovered ? 1 : '', order: 5}} onMouseEnter={handleHoverVolume} onMouseLeave={handleLeaveVolume}>
                            <input type="range" className="audio-player-volumebar audio-slider" min={0} max={1} step={0.01} value={audioRef.current?.volume} onChange={handleVolumeChange} />
                        </div>
                        <div className="audio-player-repeat-icon-container icons-container" onClick={handleRepeat} style={{order: 2}}>
                            {repeatIcon}
                        </div>
                        <div className={`audio-player-shuffle-icon-container icons-container${ !isShuffled ? " icon-light" : "" }`} onClick={handleShuffle} style={{order: 3}}>
                            {<IoShuffleOutline className="audio-player-shuffle-icon"/>}
                        </div>
                        <div className='icons-container' style={{order: 4}}><IoCloseOutline className="audio-player-close-icon" onClick={() => { setVisible(false) }} />  </div>
                    </div>                      
                    <audio id="audio" src={`${process.env.REACT_APP_DEV_URL}/get_track/${sources[sourceIndex]?.id}`} ref={audioRef} onTimeUpdate={handleTimeUpdate} />
                    
                </div>
            )}
        </>
    )
};

export default AudioPlayer;
