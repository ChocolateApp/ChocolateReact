import { usePost } from './useFetch';
import { LoginResponse, User } from '@/Types';
import useLoginStore from '@/Stores/LoginStore';

const useLogin = () => {
    const { login: storeLogin, logout: storeLogout, isLoggedIn: storeIsLoggedIn, profileData: storeProfileData, updateProfileData: storeUpdateProfileData } = useLoginStore();

    const { handleSubmit: handleLoginReq } = usePost();

    const handleLoginResponse = (loginData: LoginResponse | any) => {
        if (!loginData) return;

        if (loginData.error) {
            throw new Error(loginData.error);
        }

        if (loginData.data) {
            const { access_token, refresh_token, user } = loginData.data as LoginResponse['data'];
            storeLogin(access_token, refresh_token, user);
        }
    }

    const login = async ({ username, password }: { username: string, password: string }) => {
        await handleLoginReq({
            url: '/api/auth/login',
            body: {
                "username": username,
                "password": password
            },
            dispatcher: handleLoginResponse,
        })
    };

    const logout = () => {
        storeLogout();
    };

    const updateProfileData = (data: User) => {
        storeUpdateProfileData(data);
    };

    return {
        login,
        logout,
        isLoggedIn: storeIsLoggedIn,
        profileData: storeProfileData,
        updateProfileData,
    };
};

export default useLogin;