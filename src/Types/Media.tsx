interface MediaImages {
    cover: string;
    banner: string;
    logo: string;
}

interface EPG {
    title: string;
    start: string;
    stop: string;
    description: string;
    cover: string;
}

interface Media {
    id: number;
    banner_id: number;
    title: string;
    serie_title?: string;
    description: string;
    have_logo: boolean;
    type: string;
    note: number;
    duration: number;
    genres: number[];
    release_date: string;
    number?: number;
    file_date: string;
    serie_representation?: SeasonRepresentation[];
    last_duration?: number;
    images: MediaImages;
    _tv_path?: string;
    _source?: string;
    _epg?: EPG;
    _next?: number | null;
    _previous?: number | null;
}


interface SeasonRepresentation {
    season_id: number
    season_number: number
    episodes: Media[]
}

interface SearchData {
    main_media: Media;
    medias: Media[];
}

interface HomeMedias {
    main_media: Media;
    continue_watching: Media[];
    latest: Media[];
    recently_added: Media[];
    top_rated: Media[];
    best_of_year: Media[];
    family: Media[];
    comedy: Media[];
    animated: Media[];
    action: Media[];
    thriller: Media[];
    horror: Media[];
    drama: Media[];
    western: Media[];
}

export type { Media, HomeMedias, SearchData, SeasonRepresentation, MediaImages };