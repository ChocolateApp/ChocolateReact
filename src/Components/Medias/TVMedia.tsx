import { Media } from '@/Types';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface TVMediaCardProps {
    media: Media;
}

const TVMedia: React.FC<TVMediaCardProps> = ({ media }) => {
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const isHoveredRef = useRef(false);

    const navigate = useNavigate();

    const handleHover = () => {
        isHoveredRef.current = true;
        const timeout = setTimeout(() => {
            if (isHoveredRef.current) {
                setIsHovered(true);
            }
        }, 500);
        setHoverTimeout(timeout);
    };

    const handleLeave = () => {
        isHoveredRef.current = false;
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        setIsHovered(false);
    };

    const handleClicked = () => {
        navigate(`/watch/${media.type}/${media.id}`);
    }

    return (
        <article onMouseEnter={handleHover} onMouseLeave={handleLeave} onClick={handleClicked} className='relative'>
            <img
                src={`${media._epg?.icon}`}
                alt={media.serie_title || media.title}
                className='w-full h-full object-contain rounded-md select-none'
            />
            <section className='absolute w-16 h-16 p-3 bottom-2 right-2 rounded-full bg-slate-50 flex items-center justify-center'>
                <img
                    src={`${media.images.banner}`}
                    alt={media.serie_title || media.title}
                    className='max-w-12 max-h-12 object-contain rounded-md select-none'
                />
            </section>
        </article >
    );
};

export default TVMedia;
