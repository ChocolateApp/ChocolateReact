import { User } from "./Users";

interface LoginStore {
    access_token: string;
    refresh_token: string;
    profileData: User | null;
    isLoggedIn: boolean;
    login: (access_token: string, refresh_token: string, user: User) => void;
    logout: () => void;
    updateProfileData: (data: User) => void;
    updateAccessToken: (access_token: string) => void;
}

export type { LoginStore };