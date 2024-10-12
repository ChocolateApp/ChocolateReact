import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Hls, { Level, MediaPlaylist } from "hls.js";
import { IoPause, IoPlay } from "react-icons/io5";
import { MdCast, MdCheck, MdFullscreen, MdFullscreenExit, MdHd, MdHeadphones, MdSubtitles, MdVolumeOff, MdVolumeUp, MdVolumeDown, MdVolumeMute, MdChevronRight, MdChevronLeft, MdFilterNone } from "react-icons/md";
import { useGet } from "@/Hooks/useFetch";
import { Media, SeasonRepresentation } from "@/Types";
import Loading from "@/Components/Loading";
import useLoginStore from "@/Stores/LoginStore";

interface DropdownProps {
    icon?: React.ReactNode;
    values: MediaPlaylist[] | Level[];
    selectedValue: MediaPlaylist | Level | null;
    canDeselect?: boolean;
    setSelectedValue: (value: any) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ icon, values, selectedValue, canDeselect, setSelectedValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleDropdownToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleValueSelection = (value: MediaPlaylist | Level) => {
        if (canDeselect && selectedValue?.id === value.id) {
            setSelectedValue(null);
        } else {
            setSelectedValue(value);
        }
        setIsOpen(false);
        return;
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative hover:bg-neutral-700 p-1 rounded" ref={dropdownRef}>
            <button className="py-1 rounded flex items-center gap-2" onClick={handleDropdownToggle}>
                {icon !== undefined && icon}
            </button>
            {isOpen && (
                <ul className="absolute bottom-[120%] min-w-fit w-full right-0 bg-neutral-800 border border-neutral-700 rounded mt-2">
                    {values.map((value) => (
                        <li
                            key={value.id}
                            className="px-4 py-2 cursor-pointer hover:bg-neutral-700 w-full flex gap-2 items-center justify-start overflow-visible text-nowrap"
                            onClick={() => handleValueSelection(value)}
                        >
                            {value.id !== selectedValue?.id && icon}
                            {value.id === selectedValue?.id && <MdCheck />}
                            {value.name || `${value.height}p`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

interface SerieRepresentationProps {
    icon?: React.ReactNode
    seasons?: SeasonRepresentation[]
    currentEpisodeId?: number
    onSelect: (episode: Media) => void
}

const SerieRepresentation: React.FC<SerieRepresentationProps> = ({ icon, seasons = [], currentEpisodeId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedSeason, setSelectedSeason] = useState<SeasonRepresentation | null>(null)
    const [selectedEpisode, setSelectedEpisode] = useState<Media | null>(null)
    const serieRepresentationRef = useRef<HTMLElement>(null)

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
    }

    const handleSeasonSelect = (e: React.MouseEvent, season: SeasonRepresentation) => {
        e.stopPropagation()
        setSelectedSeason(season)
    }

    const handleEpisodeSelect = (e: React.MouseEvent, episode: Media) => {
        e.stopPropagation()
        setSelectedEpisode(episode)
        onSelect(episode)
        setIsOpen(false)
    }

    const handleBack = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedSeason(null)
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (serieRepresentationRef.current && !serieRepresentationRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    return (
        <section className="relative" aria-label="Episode selector" ref={serieRepresentationRef}>
            <button
                className="p-2 rounded flex items-center gap-2 hover:bg-neutral-700"
                onClick={handleDropdownToggle}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {icon}
                {!icon && <span className="sr-only">Select episode:</span>}
            </button>
            {isOpen && (
                <section
                    className="absolute bottom-full right-0 mb-2 bg-neutral-800 border border-neutral-700 rounded shadow-lg max-h-[300px] overflow-y-auto w-auto"
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                >
                    {!selectedSeason ? (
                        <ul className="py-2" role="list">
                            {seasons.length > 0 ? (
                                seasons.map((season) => (
                                    <li
                                        key={season.season_id}
                                        className="px-4 py-2 cursor-pointer hover:bg-neutral-700 flex justify-between items-center"
                                        onClick={(e) => handleSeasonSelect(e, season)}
                                        role="menuitem"
                                    >
                                        <span className="text-nowrap">Season {season.season_number}</span>
                                        <MdChevronRight className="h-4 w-4" aria-hidden="true" />
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-neutral-400" role="menuitem">No seasons available</li>
                            )}
                        </ul>
                    ) : (
                        <ul className="py-2" role="list">
                            <li
                                className="px-4 py-2 cursor-pointer hover:bg-neutral-700 flex items-center"
                                onClick={handleBack}
                                role="menuitem"
                            >
                                <MdChevronLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                                Back to Seasons
                            </li>
                            {selectedSeason.episodes.map((episode) => (
                                <li
                                    key={episode.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-neutral-700 flex gap-4 items-center min-w-max"
                                    onClick={(e) => handleEpisodeSelect(e, episode)}
                                    role="menuitem"
                                >
                                    {selectedEpisode?.id === episode.id || currentEpisodeId === episode.id ? <MdCheck className="h-4 w-4" aria-hidden="true" /> : <section className="h-4 w-4"></section>}
                                    <img src={episode.images.banner} alt={episode.title} className="w-16 h-9 rounded-md" />
                                    <span className="text-nowrap">Episode {episode.number}: {episode.title}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </section>
    )
}

const VideoMedia = () => {
    const playerRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);

    const [progress, setProgress] = useState(0);
    const [HLS, setHLS] = useState<Hls | null>(null);

    const [audioTracks, setAudioTracks] = useState<MediaPlaylist[]>([]);
    const [subtitleTracks, setSubtitleTracks] = useState<MediaPlaylist[]>([]);
    const [qualityTracks, setQualityTracks] = useState<Level[]>([]);

    const [selectedAudioTrack, setSelectedAudioTrack] = useState<MediaPlaylist | null>(null);
    const [selectedSubtitleTrack, setSelectedSubtitleTrack] = useState<MediaPlaylist | null>(null);
    const [selectedQualityTrack, setSelectedQualityTrack] = useState<Level | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isControlVisible, setIsControlVisible] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const [volume, setVolume] = useState(1);
    const [previousVolume, setPreviousVolume] = useState(volume);

    const { id, type } = useParams<{ id: string, type: string }>();

    const navigate = useNavigate();

    const { data: mediaData } = useGet(`/api/medias/media/${type}/${id}`) as { data: any };

    let hideControlsTimeout: NodeJS.Timeout;

    const navigateTo = useCallback((episode: Media) => {
        navigate(`/watch/${type}/${episode.id}`);
    }, [navigate, type]);

    const intToTime = (time: number | undefined) => {
        if (!time) return "0:00";

        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - (hours * 3600)) / 60);
        const seconds = Math.floor(time - (hours * 3600) - (minutes * 60));

        const formattedSeconds = String(seconds).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');

        if (hours > 0) {
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        } else if (minutes > 0) {
            return `${formattedMinutes}:${formattedSeconds}`;
        } else {
            return `00:${formattedSeconds}`;
        }
    };

    const { updateProfileData, updateAccessToken } = useLoginStore();

    useEffect(() => {
        // Réinitialiser l'état et les références
        setProgress(0);
        setIsLoading(true);
        setAudioTracks([]);
        setSubtitleTracks([]);
        setQualityTracks([]);
        setSelectedAudioTrack(null);
        setSelectedSubtitleTrack(null);
        setSelectedQualityTrack(null);

        if (HLS) {
            HLS.destroy();
            setHLS(null);
        }
        if (playerRef.current) {
            playerRef.current.src = '';
            playerRef.current.load();
        }

        let url = `${import.meta.env.VITE_API_URL}/api/watch/${type}/${id}`;

        if (mediaData?.data?._source) {
            url = mediaData.data._source;
        }

        if (playerRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    xhrSetup: (xhr, url) => {
                        xhr.open("GET", url, true);

                        if (url.includes(import.meta.env.VITE_API_URL)) {
                            xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
                            xhr.setRequestHeader("X-Current-Time", String(playerRef.current?.currentTime || 0));
                        }

                        xhr.onreadystatechange = async () => {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                try {
                                    const response = JSON.parse(xhr.responseText);
                                    if (response.code === 246) {
                                        const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                                            method: "POST",
                                            body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        });

                                        const refreshData = await refreshRes.json();

                                        if (refreshData.error) {
                                            navigate("/login");
                                            return;
                                        } else {
                                            let access_token = refreshData.data.access_token;
                                            localStorage.setItem("access_token", access_token);
                                            updateAccessToken(refreshData.data.access_token);
                                            updateProfileData(refreshData.data.user);

                                            xhr.open("GET", url, true);
                                            if (url.includes(import.meta.env.VITE_API_URL)) {
                                                xhr.setRequestHeader("Authorization", `Bearer ${access_token}`);
                                                xhr.setRequestHeader("X-Current-Time", String(playerRef.current?.currentTime || 0));
                                            }
                                            xhr.send();
                                        }
                                    }
                                } catch (error) {
                                    console.error(`Error parsing response: ${error}`);
                                }
                            }
                        }
                    }
                });
                hls.loadSource(url);
                hls.attachMedia(playerRef.current);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    playerRef.current?.play();
                });

                hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
                    setAudioTracks(hls.audioTracks);
                    let selectedAudioTrack = hls.audioTracks.find(track => track.default);
                    if (!selectedAudioTrack) {
                        selectedAudioTrack = hls.audioTracks[0];
                    }
                    setSelectedAudioTrack(selectedAudioTrack);
                });

                hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
                    setSubtitleTracks(hls.subtitleTracks);
                });

                hls.on(Hls.Events.BUFFER_CREATED, () => {
                    setIsLoading(true);
                });

                hls.on(Hls.Events.FRAG_BUFFERED, () => {
                    setIsLoading(false);
                });

                playerRef.current.addEventListener("timeupdate", () => {
                    setProgress(playerRef.current?.currentTime || 0);
                    let levels = hls.levels;
                    if (levels.find(level => level.height === -1) === undefined) {
                        levels.push({ height: -1, name: "auto" } as Level);
                    }
                    setQualityTracks(levels);
                });

                setHLS(hls);
            } else if (playerRef.current.canPlayType("application/vnd.apple.mpegurl")) {
                playerRef.current.src = url;
            }
        }

        return () => {
            if (HLS) {
                HLS.destroy();
            }
        };
    }, [id, type]);

    useEffect(() => {
        if (!playerRef.current) return;

        const handleLoadedMetadata = () => {
            if (mediaData?.data?.last_duration && playerRef.current) {
                playerRef.current.currentTime = mediaData.data.last_duration;
                playerRef.current.play();
            }
        };

        const handleLoadedData = () => {
            if (playerRef.current) {
                playerRef.current.play();
            }
        };

        playerRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
        playerRef.current.addEventListener("loadeddata", handleLoadedData);

        return () => {
            if (playerRef.current) {
                playerRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
                playerRef.current.removeEventListener("loadeddata", handleLoadedData);
            }
        };
    }, [mediaData?.data?.last_duration]);

    useEffect(() => {
        const savedVolume = localStorage.getItem("video-volume");
        if (savedVolume && playerRef.current) {
            const volumeValue = Number(savedVolume);
            setVolume(volumeValue);
            playerRef.current.volume = volumeValue;
        }
    }, []);

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (playerRef.current) {
            playerRef.current.currentTime = Number(e.target.value);
            setProgress(Number(e.target.value));
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.volume = newVolume;
        }
        localStorage.setItem("video-volume", String(newVolume));
    };

    useEffect(() => {
        if (!HLS) return;

        if (selectedAudioTrack) {
            try {
                HLS.audioTrack = HLS.audioTracks.findIndex(track => track.id === selectedAudioTrack.id);
            } catch (error) {
                // Do nothing
            }
        }

        if (selectedSubtitleTrack) {
            HLS.subtitleTrack = HLS.subtitleTracks.findIndex(track => track.id === selectedSubtitleTrack.id);
        } else {
            HLS.subtitleTrack = -1;
        }

        if (selectedQualityTrack) {
            HLS.currentLevel = HLS.levels.findIndex(track => track.height === selectedQualityTrack.height);
        }
    }, [selectedAudioTrack, selectedSubtitleTrack, selectedQualityTrack, HLS]);

    const toggleFullscreen = () => {
        if (containerRef.current) {
            if (!isFullscreen) {
                containerRef.current.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen();
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    const handleMouseMove = () => {
        setIsControlVisible(true);
        clearTimeout(hideControlsTimeout);

        hideControlsTimeout = setTimeout(() => {
            if (!controlsRef.current?.matches(':hover')) {
                setIsControlVisible(false);
            }
        }, 5000);
    };

    const toggleMute = () => {
        if (volume > 0) {
            setPreviousVolume(volume);
            setVolume(0);
            if (playerRef.current) {
                playerRef.current.volume = 0;
            }
        } else {
            setVolume(previousVolume);
            if (playerRef.current) {
                playerRef.current.volume = previousVolume;
            }
        }
    };

    const toggleCaptions = () => {
        if (HLS) {
            const nextTrack = HLS.subtitleTrack === -1 ? 0 : -1;
            HLS.subtitleTrack = nextTrack;
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!playerRef.current) return;
        switch (e.key) {
            case "f":
                toggleFullscreen();
                break;
            case "m":
                toggleMute();
                break;
            case "c":
                toggleCaptions();
                break;
            case " ":
                e.preventDefault();
                if (playerRef.current.paused) {
                    playerRef.current.play();
                } else {
                    playerRef.current.pause();
                }
                break;
            case "ArrowLeft":
                playerRef.current.currentTime = Math.max(0, playerRef.current.currentTime - 10);
                break;
            case "ArrowRight":
                playerRef.current.currentTime = Math.min(playerRef.current.duration, playerRef.current.currentTime + 10);
                break;
            case "ArrowUp":
                setVolume(prevVolume => {
                    const newVolume = Math.min(1, prevVolume + 0.05);
                    if (playerRef.current) {
                        playerRef.current.volume = newVolume;
                    }
                    return newVolume;
                });
                break;
            case "ArrowDown":
                setVolume(prevVolume => {
                    const newVolume = Math.max(0, prevVolume - 0.05);
                    if (playerRef.current) {
                        playerRef.current.volume = newVolume;
                    }
                    return newVolume;
                });
                break;
            case "PageUp":
                if (mediaData?.data?._next) {
                    navigate(`/watch/${type}/${mediaData.data._next}`);
                }
                break;
            case "PageDown":
                if (mediaData?.data?._previous) {
                    navigate(`/watch/${type}/${mediaData.data._previous}`);
                }
                break;
            default:
                break;
        }
    }, [toggleFullscreen, toggleMute, toggleCaptions]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const getVolumeIcon = () => {
        if (volume === 0) return <MdVolumeOff />;
        if (volume <= 0.3) return <MdVolumeMute />;
        if (volume <= 0.6) return <MdVolumeDown />;
        return <MdVolumeUp />;
    };

    return (
        <section className={`bg-black relative ${!isControlVisible ? "cursor-none" : ""}`} ref={containerRef} onMouseMove={handleMouseMove}>
            <video ref={playerRef} key={id} className="w-full h-screen" />
            <Loading className={`top-0 left-0 fixed h-screen w-screen transition-all duration-300 pointer-events-none z-50 ${isLoading ? "opacity-100" : "opacity-0"}`} />
            <section className={`absolute bottom-0 w-full flex flex-col justify-end z-20 ${isControlVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-300`} ref={controlsRef}>
                <section className="flex items-center justify-between px-4 py-2 bg-neutral-800 bg-opacity-75 gap-4">
                    <button onClick={() => playerRef.current?.paused ? playerRef.current?.play() : playerRef.current?.pause()} className="hover:bg-neutral-700 p-1 rounded">
                        {playerRef.current?.paused ? <IoPlay /> : <IoPause />}
                    </button>
                    <div className="volume-hover relative group flex items-center">
                        <div className="flex items-center group-hover:bg-neutral-700 p-1 rounded relative">
                            <button className="flex items-center" title="Volume" onClick={toggleMute}>
                                {getVolumeIcon()}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volume-slider"
                            />
                        </div>
                    </div>
                    <input
                        type="range"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        min={0}
                        max={playerRef.current?.duration || 0}
                        value={progress}
                        onChange={handleProgressChange}
                    />
                    <span>{intToTime(progress)}/{intToTime(playerRef.current?.duration)}</span>
                    <section className="flex gap-2 items-center">
                        {audioTracks?.length > 1 && <Dropdown icon={<MdHeadphones />} values={audioTracks} selectedValue={selectedAudioTrack} setSelectedValue={setSelectedAudioTrack} />}
                        {subtitleTracks?.length > 0 && <Dropdown icon={<MdSubtitles />} values={subtitleTracks} selectedValue={selectedSubtitleTrack} setSelectedValue={setSelectedSubtitleTrack} canDeselect={true} />}
                        {mediaData?.data?.serie_representation && <SerieRepresentation seasons={mediaData.data.serie_representation} onSelect={navigateTo} icon={<MdFilterNone />} currentEpisodeId={parseInt(id || "0")} />}

                        <Dropdown icon={<MdHd />} values={qualityTracks} selectedValue={selectedQualityTrack} setSelectedValue={setSelectedQualityTrack} />
                        <button className="hover:bg-neutral-700 p-1 rounded">
                            <MdCast />
                        </button>
                        <button onClick={toggleFullscreen} className="hover:bg-neutral-700 p-1 rounded">
                            {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                        </button>
                    </section>
                </section>
            </section>
        </section>
    );
};

export default VideoMedia;
