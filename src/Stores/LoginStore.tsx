import { create } from "zustand";
import { User, LoginStore } from "@/Types";
import { persist } from "zustand/middleware";

const useLoginStore = create<LoginStore>()(
    persist(
        (set) => ({
            access_token: localStorage.getItem("access_token") || "",
            refresh_token: localStorage.getItem("refresh_token") || "",
            profileData: null,
            isLoggedIn: false,
            updateAccessToken: (access_token: string) => {
                set({ access_token: access_token });
            },
            updateProfileData: (data: User) => {
                set({ profileData: data });
            },
            login: (access_token: string, refresh_token: string, user: User) => {
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                set({ access_token, refresh_token, profileData: user, isLoggedIn: true });
            },
            logout: () => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                set({ access_token: "", refresh_token: "", profileData: null, isLoggedIn: false });
            },
        }),
        {
            name: "login-storage",
            getStorage: () => localStorage,
        }
    )
);

export default useLoginStore;