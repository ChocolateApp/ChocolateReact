import { HomeMedias } from "./Media";
import { User } from "./Users";

interface MainAPIResponses {
    code: number;
    error: boolean;
    message: string;
    data: any;
}

interface LoginResponse extends MainAPIResponses {
    data: {
        refresh_token: string;
        access_token: string;
        user: User;
    }
}

interface HomeResponse extends MainAPIResponses {
    data: HomeMedias;
}

export type { MainAPIResponses, LoginResponse, HomeResponse };