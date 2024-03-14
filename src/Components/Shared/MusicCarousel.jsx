import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

import { useAudioPlayerStore } from '../../App';

import { useLangage } from '../../Utils/useLangage';

export function PlaylistCarousel({ playlists, lib }) {
  const containerRef = useRef(null);
  const itemRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [slideRight, setSlideRight] = useState(false);
  const [slideLeft, setSlideLeft] = useState(false);
  const [position, setCarouselPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  

  const navigate = useNavigate();

  const { getLang } = useLangage();

  useEffect(() => {
    const itemElement = itemRef.current;
    const containerElement = containerRef.current;
    if (itemElement) {
      let { width } = itemElement.getBoundingClientRect();
      width += parseInt(getComputedStyle(containerElement).columnGap);
      setItemWidth(width * 2);
    }
  }, []);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (containerElement) {
        const { width } = containerElement.getBoundingClientRect();
        setContainerWidth(width);
    }
    }, [containerRef]);

  useLayoutEffect(() => {
    if (containerRef.current && containerRef.current.scrollWidth > containerRef.current?.clientWidth) {
      setSlideRight(true);
    } else {
      setSlideRight(false);
    }

    if (containerRef.current && containerRef.current.scrollLeft > 0) {
      setSlideLeft(true);
    } else {
      setSlideLeft(false);
    }
  }, [containerRef]);

  useEffect(() => {
    if (position === 0) {
      setSlideLeft(false);
    } else {
      setSlideLeft(true);
    }
  }, [position]);

  useEffect(() => {
    const containerElement = containerRef.current;

    const handleScroll = () => {
      const maxScrollLeft = containerElement?.scrollWidth - containerElement?.clientWidth;
      const currentPosition = containerElement?.scrollLeft;

      if (currentPosition === maxScrollLeft) {
        setSlideRight(false);
      } else {
        setSlideRight(true);
      }


    };

    const handleScrollEnd = () => {
      const scrollLeft = containerRef.current.scrollLeft;
  
      if (scrollLeft % itemWidth > 0.2 || scrollLeft % itemWidth < -0.2) {
        let target = Math.round(scrollLeft / itemWidth) * itemWidth;
        containerRef.current.scrollTo({
          left: target,
          behavior: 'smooth',
        });
      }
    };

    containerElement?.addEventListener('scroll', handleScroll);
    containerElement?.addEventListener('scrollend', handleScrollEnd);
    return () => {
      containerElement?.removeEventListener('scroll', handleScroll);
      containerElement?.removeEventListener('scrollend', handleScrollEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({
      left: -itemWidth,
      behavior: 'smooth',
    });
    setCarouselPosition(position - 1);
  };

  const handleScrollRight = () => {
    containerRef.current.scrollBy({
      left: itemWidth,
      behavior: 'smooth',
    });
    setCarouselPosition(position + 1);
  };
  
  return (
    <div className="main-carousel" data-aos="fade-up">
      <div className="carousel-header">{getLang("playlists")}:</div>
      {slideLeft && (
        <div className="carousel-arrow" onClick={handleScrollLeft}>
            <IoChevronBack />
        </div>
      )}
      <div className="carousel-container" ref={containerRef}>
        {playlists.map((playlist, index) => (
          <div key={index} className={`carousel-item ${hoveredIndex && (hoveredIndex - (position*2) - 1 === index) ? 'carousel-item-hovered' : ''}`} ref={itemRef} onClick={() => navigate(`/playlist/${lib}/${playlist.id}`)} onMouseEnter={() => setHoveredIndex(index+1)} onMouseLeave={() => setHoveredIndex(null)}>
            <img src={`${process.env.REACT_APP_DEV_URL}/playlist_cover/${playlist.id}`} alt={playlist.name} className="carousel-cover" />
            <div className="carousel-info">
              <div className="carousel-name">{playlist.name}</div>
              <div className="carousel-tracks">{`${playlist.tracks.split(',').length} titre${playlist.tracks.split(',').length > 1 ? 's' : ''}`}</div>
            </div>
          </div>
        ))}
      </div>
      {slideRight && (
        <div className="carousel-arrow" onClick={handleScrollRight} style={{ marginLeft: `calc(${containerWidth}px - 4rem)` }}>
            <IoChevronForward />
        </div>
      )}
    </div>
  );
};


export function AlbumCarousel({ albums, lib }) {
  const containerRef = useRef(null);
  const itemRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [slideRight, setSlideRight] = useState(false);
  const [slideLeft, setSlideLeft] = useState(false);
  const [position, setCarouselPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navigate = useNavigate();
  
  const { getLang } = useLangage();

  useEffect(() => {
    const itemElement = itemRef.current;
    const containerElement = containerRef.current;
    if (itemElement) {
      let { width } = itemElement.getBoundingClientRect();
      width += parseInt(getComputedStyle(containerElement).columnGap);
      setItemWidth(width * 2);
    }
  }, []);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (containerElement) {
        const { width } = containerElement.getBoundingClientRect();
        setContainerWidth(width);
    }
    }, [containerRef]);

  useLayoutEffect(() => {
    if (containerRef.current && containerRef.current.scrollWidth > containerRef.current?.clientWidth) {
      setSlideRight(true);
    } else {
      setSlideRight(false);
    }

    if (containerRef.current && containerRef.current.scrollLeft > 0) {
      setSlideLeft(true);
    } else {
      setSlideLeft(false);
    }
  }, [containerRef]);

  useEffect(() => {
    if (position === 0) {
      setSlideLeft(false);
    } else {
      setSlideLeft(true);
    }
  }, [position]);

  useEffect(() => {
    const containerElement = containerRef.current;
    let maxScrollLeft = containerElement?.scrollWidth - containerElement?.clientWidth;
    let currentPosition = containerElement?.scrollLeft;

    console.log(`containerElement?.scrollWidth: ${containerElement?.scrollWidth}, containerElement?.clientWidth: ${containerElement?.clientWidth}`);

    const handleScroll = () => {
      maxScrollLeft = containerElement?.scrollWidth - containerElement?.clientWidth;
      currentPosition = containerElement?.scrollLeft;

      if (maxScrollLeft <= currentPosition) {
        setSlideRight(false);
      } else {
        setSlideRight(true);
      }
    };

    const handleScrollEnd = () => {
      const scrollLeft = containerRef.current.scrollLeft;
  
      if (scrollLeft % itemWidth > 0.2 || scrollLeft % itemWidth < -0.2) {
        let target = Math.round(scrollLeft / itemWidth) * itemWidth;
        containerRef.current.scrollTo({
          left: target,
          behavior: 'smooth',
        });
      }
    };

    containerElement?.addEventListener('scroll', handleScroll);
    containerElement?.addEventListener('scrollend', handleScrollEnd);
    return () => {
      containerElement?.removeEventListener('scroll', handleScroll);
      containerElement?.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [containerWidth, itemWidth, containerRef]);

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({
      left: -itemWidth,
      behavior: 'smooth',
    });
    setCarouselPosition(position - 1);
  };

  const handleScrollRight = () => {
    containerRef.current.scrollBy({
      left: itemWidth,
      behavior: 'smooth',
    });
    setCarouselPosition(position + 1);
  };

  const resizeText = (val) => {
    return val.length > 21 ? val.substring(0, 18) + "..." : val;
  }

  return (
    <div className="main-carousel" data-aos="fade-up">
      <div className="carousel-header">{getLang("albums")}:</div>
      {slideLeft && (
        <div className="carousel-arrow" onClick={handleScrollLeft}>
            <IoChevronBack />
        </div>
      )}
      <div className="carousel-container" ref={containerRef}>
        {albums && albums.map((album, index) => (
          <div key={index} className={`carousel-item ${hoveredIndex && (hoveredIndex - (position*2) - 1 === index) ? 'carousel-item-hovered' : ''}`} ref={itemRef} onMouseEnter={() => setHoveredIndex(index+1)} onMouseLeave={() => setHoveredIndex(null)}>
            <img src={`${process.env.REACT_APP_DEV_URL}/album_cover/${album.id}`} alt={album.name} className="carousel-cover" onClick={() => navigate(`/album/${lib}/${album.id}`)} />
            <div className="carousel-info" onClick={() => navigate(`/album/${lib}/${album.id}`)} >
              <div className="carousel-name">{resizeText(album.name)}</div>
              <div className="carousel-tracks">{`${album.tracks.split(',').length} titres`}</div>
            </div>
          </div>
        ))}
      </div>
      {slideRight && (
        <div className="carousel-arrow" onClick={handleScrollRight} style={{ marginLeft: `calc(${containerWidth}px - 4rem)` }}>
            <IoChevronForward />
        </div>
      )}
    </div>
  );
};

export function ArtistCarousel({ artists, lib }) {
  const containerRef = useRef(null);
  const itemRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [slideRight, setSlideRight] = useState(false);
  const [slideLeft, setSlideLeft] = useState(false);
  const [position, setCarouselPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const navigate = useNavigate();

  const { getLang } = useLangage();

  useEffect(() => {
    const itemElement = itemRef.current;
    const containerElement = containerRef.current;
    if (itemElement) {
      let { width } = itemElement.getBoundingClientRect();
      width += parseInt(getComputedStyle(containerElement).columnGap);
      setItemWidth(width * 2);
    }
  }, []);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (containerElement) {
        const { width } = containerElement.getBoundingClientRect();
        setContainerWidth(width);
    }
    }, [containerRef]);

  useLayoutEffect(() => {
    if (containerRef.current && containerRef.current.scrollWidth > containerRef.current?.clientWidth) {
      setSlideRight(true);
    } else {
      setSlideRight(false);
    }

    if (containerRef.current && containerRef.current.scrollLeft > 0) {
      setSlideLeft(true);
    } else {
      setSlideLeft(false);
    }
  }, [containerRef]);

  useEffect(() => {
    if (position === 0) {
      setSlideLeft(false);
    } else {
      setSlideLeft(true);
    }
  }, [position]);

  useEffect(() => {
    const containerElement = containerRef.current;

    const handleScroll = () => {
      const maxScrollLeft = containerElement?.scrollWidth - containerElement?.clientWidth;
      const currentPosition = containerElement?.scrollLeft;

      if (currentPosition === maxScrollLeft) {
        setSlideRight(false);
      } else {
        setSlideRight(true);
      }
    };

    const handleScrollEnd = () => {
      const scrollLeft = containerRef.current.scrollLeft;
  
      if (scrollLeft % itemWidth > 0.2 || scrollLeft % itemWidth < -0.2) {
        let target = Math.round(scrollLeft / itemWidth) * itemWidth;
        containerRef.current.scrollTo({
          left: target,
          behavior: 'smooth',
        });
      }
    };

    containerElement?.addEventListener('scroll', handleScroll);
    containerElement?.addEventListener('scrollend', handleScrollEnd);
    return () => {
      containerElement?.removeEventListener('scroll', handleScroll);
      containerElement?.removeEventListener('scrollend', handleScrollEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({
      left: -itemWidth,
      behavior: 'smooth',
    });
    setCarouselPosition(position - 1);
  };

  const handleScrollRight = () => {
    containerRef.current.scrollBy({
      left: itemWidth,
      behavior: 'smooth',
    });
    setCarouselPosition(position + 1);
  };

  const resizeText = (val) => {
    return val.length > 21 ? val.substring(0, 18) + "..." : val;
  }


  return (
    <div className="main-carousel" data-aos="fade-up">
      <div className="carousel-header">{getLang("artists")}:</div>
      {slideLeft && (
        <div className="carousel-arrow" onClick={handleScrollLeft}>
            <IoChevronBack />
        </div>
      )}
      <div className="carousel-container" ref={containerRef}>
        {artists.map((artist, index) => (
          <div key={index} className="carousel-item" ref={itemRef} onClick={() => navigate(`/artist/${lib}/${artist.id}`)}>
            <img src={`${process.env.REACT_APP_DEV_URL}/artist_image/${artist.id}`} alt={artist.name} className="carousel-cover artist-cover" />
            <div className="carousel-info">
              <div className="carousel-name artist-name">{resizeText(artist.name)}</div>
            </div>
          </div>
        ))}
      </div>
      {slideRight && (
        <div className="carousel-arrow" onClick={handleScrollRight} style={{ marginLeft: `calc(${containerWidth}px - 4rem)` }}>
            <IoChevronForward />
        </div>
      )}
    </div>
  );
};

export function TracksCarousel({ tracks, lib }) {
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [slideRight, setSlideRight] = useState(false);
  const [slideLeft, setSlideLeft] = useState(false);
  const [theTracks, setTracks] = useState([[]]);
  
  const { getLang } = useLangage();

  useEffect(() => {
    const listesDivisees = [];
    for (let i = 0; i < tracks.length; i += 12) {
      listesDivisees.push(tracks.slice(i, i + 12));
    }
    setTracks(listesDivisees);
    setMaxIndex(listesDivisees.length - 1);
  }, [tracks]);


  useEffect(() => {
    if (index === 0) {
      setSlideLeft(false);
    } else {
      setSlideLeft(true);
    }

    if (index === maxIndex) {
      setSlideRight(false);
    } else {
      setSlideRight(true);
    }
  }, [index, maxIndex]);

  const handleScrollLeft = () => {
    setIndex(index - 1);
  };

  const handleScrollRight = () => {
    setIndex(index + 1);
  };

  if (!theTracks || theTracks.length === 0) {
    return null; // ou affichez un indicateur de chargement ou un message approprié si les pistes ne sont pas disponibles
  }

  const currentTrackList = theTracks[index] || null; // assurez-vous que currentTrackList est un tableau

  return (
    <div className="main-carousel single-carousel">
      <div className="carousel-header">{getLang("singles")}:</div>
      {slideLeft && (
        <div className="carousel-arrow tracks-arrow-left" onClick={handleScrollLeft}>
          <IoChevronBack />
        </div>
      )}
      <div className="carousel-container single-container">
        {currentTrackList && currentTrackList.map((track, index) => (
          <TrackCarouselRow key={index} track={track} />
        ))}
      </div>
      {slideRight && (
        <div className="carousel-arrow tracks-arrow-right" onClick={handleScrollRight}>
          <IoChevronForward />
        </div>
      )}
    </div>
  );
};

const TrackCarouselRow = ({ track }) => {
  const { setSources, setVisible, setIsPlaying, setSourceIndex } = useAudioPlayerStore();

  const resizeText = (val) => {
    return val.length > 21 ? val.substring(0, 18) + "..." : val;
  };
    
  function handlePlay() {
    setVisible(true);
    setIsPlaying(true);
    setSources([track]);
    setSourceIndex(0);
  }

  return (
    <div className="carousel-item single-item" onClick={handlePlay}>
      <img src={`${process.env.REACT_APP_DEV_URL}/track_cover/${track.id}`} alt={track.name} className="carousel-cover single-cover" />
      <div className="carousel-info">
        <div className="carousel-name">{resizeText(track.name)}</div>
        <div className="carousel-info">{track.album_name} • {track.artist_name}</div>
      </div>
    </div>
  )
}
