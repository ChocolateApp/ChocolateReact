import useLoginStore from "@/Stores/LoginStore";
import { MainAPIResponses } from "@/Types";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useGet = (url: string, source = import.meta.env["VITE_API_URL"]) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const { updateProfileData, updateAccessToken, logout } = useLoginStore();

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        if (url === "") {
            setLoading(false);
            return;
        }
        if (!url.startsWith("/")) {
            url = `/${url}`;
        }

        if (url.startsWith("http")) {
            source = "";
        }

        if (!source) {
            source = import.meta.env.VITE_API_URL;
        }

        let res;

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            res = await fetch(`${source}${url}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                },
                signal: abortController.signal
            });


            let data;
            try {
                data = await res.json();
            } catch (error) {
                data = await res.text();
                data = JSON.parse(data);
            }

            if (data.error && data.message === "INVALID_TOKEN") {
                throw new Error(JSON.stringify(data));
            }

            setData(data);
            setLoading(false);
            setError(null);
        } catch (error: any) {
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }
            res = JSON.parse(error.message);

            if (res.message === "INVALID_TOKEN") {
                const refreshRes = await fetch(`${source}/api/auth/refresh`, {
                    method: "POST",
                    body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const refreshData = await refreshRes.json();

                if (refreshData.error) {
                    logout();
                    navigate("/login");
                    setLoading(false);
                    return;
                } else {
                    localStorage.setItem("access_token", refreshData.data.access_token);
                    updateAccessToken(refreshData.data.access_token);
                    updateProfileData(refreshData.data.user);
                    fetchData();
                    return;
                }
            }
            setError(res);
            setLoading(false);
            setData(null);
        }
    }, [url]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const interupt = () => {
        abortControllerRef.current?.abort();
    }

    return { data, loading, error, fetchData, interupt };
};


export function usePost() {
    const [data, setData] = useState<MainAPIResponses | null>(null);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [resMsg, setResMsg] = useState<string | null>(null);

    const { access_token, refresh_token } = useLoginStore();


    const defaultHeaders = {
        Authorization: `Bearer ${access_token}`,
        "x-refresh-token": refresh_token,
    };

    const handleSubmit = async ({
        e = "",
        url,
        body = data,
        headers = { ...defaultHeaders },
        dispatcher = null,
        dispatch = (data: any) => data,
    }: { e?: any; url: string; body?: any; headers?: any; dispatcher?: any; dispatch?: any }) => {
        e && e.preventDefault();

        setPending(true);
        setError(null);
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    ...headers,
                    ...defaultHeaders,
                    "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
                },
                body: body instanceof FormData ? body : JSON.stringify(body),
            };

            if (!url.startsWith("http")) {
                url = `${import.meta.env.VITE_API_URL}${url}`;
            }

            const res = await fetch(url, requestOptions);

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            const json = await res.json();

            if (dispatcher !== null && dispatch !== null) {
                dispatcher(dispatch(json));
            } else {
                setData(json);
                setResMsg(json);
            }

            setPending(false);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setPending(false);
        }
    };

    const handleChange = (e: any) => {
        e.persist();
        setData((data: any) => ({ ...data, [e.target.name]: e.target.value }));
    };

    return { data, handleSubmit, handleChange, pending, error, resMsg };
}

export function useDelete() {
    const [data, setData] = useState<MainAPIResponses | null>(null);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [resMsg, setResMsg] = useState<string | null>(null);

    const { access_token, refresh_token } = useLoginStore();

    const defaultHeaders = {
        Authorization: `Bearer ${access_token}`,
        "x-refresh-token": refresh_token,
    };

    const handleSubmit = async ({
        e = "",
        url,
        body = data,
        headers = { ...defaultHeaders },
        dispatcher = null,
        dispatch = (data: any) => data,
    }: { e?: any; url: string; body?: any; headers?: any; dispatcher?: any; dispatch?: any }) => {
        e && e.preventDefault();

        setPending(true);
        setError(null);
        try {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    ...headers,
                    ...defaultHeaders,
                    "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
                },
                body: body instanceof FormData ? body : JSON.stringify(body),
            };

            if (!url.startsWith("http")) {
                url = `${import.meta.env.VITE_API_URL}${url}`;
            }

            const res = await fetch(url, requestOptions);

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            const json = await res.json();

            if (dispatcher !== null && dispatch !== null) {
                dispatcher(dispatch(json));
            } else {
                setData(json);
                setResMsg(json);
            }

            setPending(false);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setPending(false);
        }
    };

    const handleChange = (e: any) => {
        e.persist();
        setData((data: any) => ({ ...data, [e.target.name]: e.target.value }));
    };

    return { data, handleSubmit, handleChange, pending, error, resMsg };
}


export function usePut() {
    const [data, setData] = useState<MainAPIResponses | null>(null);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [resMsg, setResMsg] = useState<string | null>(null);

    const { access_token, refresh_token } = useLoginStore();

    const defaultHeaders = {
        Authorization: `Bearer ${access_token}`,
        "x-refresh-token": refresh_token,
    };

    const handleSubmit = async ({
        e = "",
        url,
        body = data,
        headers = { ...defaultHeaders },
        dispatcher = null,
        dispatch = (data: any) => data,
    }: { e?: any; url: string; body?: any; headers?: any; dispatcher?: any; dispatch?: any }) => {
        e && e.preventDefault();

        setPending(true);
        setError(null);
        try {
            const requestOptions = {
                method: "PUT",
                headers: {
                    ...headers,
                    ...defaultHeaders,
                    "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
                },
                body: body instanceof FormData ? body : JSON.stringify(body),
            };

            if (!url.startsWith("http")) {
                url = `${import.meta.env.VITE_API_URL}${url}`;
            }

            const res = await fetch(url, requestOptions);

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            const json = await res.json();

            if (dispatcher !== null && dispatch !== null) {
                dispatcher(dispatch(json));
            } else {
                setData(json);
                setResMsg(json);
            }

            setPending(false);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setPending(false);
        }
    };

    const handleChange = (e: any) => {
        e.persist();
        setData((data: any) => ({ ...data, [e.target.name]: e.target.value }));
    };

    return { data, handleSubmit, handleChange, pending, error, resMsg };
}