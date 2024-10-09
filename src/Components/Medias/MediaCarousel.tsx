import { Media } from '@/Types';
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import MediaCard from './MediaCard';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

interface MediaCarouselProps {
    medias: Media[];
    index: number;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ medias, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    const swiperRef = useRef<any>(null);

    const handleSlideChange = () => {
        setHasMoved(true);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className='relative w-full'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView='auto'
                direction='horizontal'
                freeMode={true}
                onSlideChange={handleSlideChange}
                className={`!overflow-visible  !w-full`}
                ref={swiperRef}
            >
                {medias.map((media, index) => (
                    <SwiperSlide key={index} className='!w-fit'>
                        <MediaCard media={media} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {hasMoved && (
                <>
                    <button
                        style={{ zIndex: index + 1 }}
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                        onClick={() => swiperRef.current?.swiper?.slidePrev()}
                    >
                        &#10094; {/* Code for the left arrow (can replace with an SVG or icon) */}
                    </button>

                    <button
                        style={{ zIndex: index + 1 }}
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                        onClick={() => swiperRef.current?.swiper?.slideNext()}
                    >
                        &#10095; {/* Code for the right arrow (can replace with an SVG or icon) */}
                    </button>
                </>
            )}
        </div>
    );
};

export default MediaCarousel;
