interface VideoProps {
    id: number;
    title: string;
    type: string;
    episodes: Episode[] | null;
    next_episode: Episode | null;
    previous_episode: Episode | null;
    previous_timestamp: number | null;
}

interface Episode {
    id: number;
    title: string;
    duration: number;
    episode_number: number;
    season_number: number;
    release_date: string;
}

export type { VideoProps, Episode };