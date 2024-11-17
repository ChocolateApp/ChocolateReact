import { Media } from '@/Types';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface MediaCardProps {
    media: Media;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
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
        <article onMouseEnter={handleHover} onMouseLeave={handleLeave} onClick={handleClicked}>
            <img
                src={`${media.images.banner}`}
                alt={media.serie_title || media.title}
                className='w-auto max-w-none h-48 object-cover rounded-md select-none'
            />
            {media.images.logo ? (
                <img
                    src={`${media.images.logo}`}
                    alt={media.serie_title || media.title}
                    className='absolute bottom-1 left-1 w-1/2 h-12 object-contain rounded-md select-none'
                />
            ) : (
                <h3 className='absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded-md select-none'>
                    {media.serie_title || media.title}
                </h3>
            )}
            <section className={`absolute bg-neutral-800 bg-opacity-50 w-full z-10 bottom-0 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <section className='w-full h-full bg-black bg-opacity-75 p-4 flex flex-col gap-2'>
                    <h3>{media.serie_title || media.title}</h3>
                    <section className='flex flex-col gap-1'>
                        {/* TODO: Use language system for the texts, and suffix */}
                        <h2>
                            Genres: {media.genres.map((genre, index) => (
                                <>
                                    <span key={index}>{genre}</span>
                                    {(index !== media.genres.length - 1) && <span> • </span>}
                                </>
                            ))}
                        </h2>
                        <h2>Note: {(+media.note).toFixed(2)}/10</h2>
                        <h2>Durée: {media.duration}{media.type === 'serie' ? ' episodes' : ''}</h2>
                    </section>
                </section>
            </section>
        </article>
    );
};

export default MediaCard;
