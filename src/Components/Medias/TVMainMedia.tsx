
import { HomeMedias } from "@/Types"
import Button from "@/Components/Button"
import { GoPlay } from "react-icons/go"
import { useEffect, useRef } from "react"
import Hls from "hls.js"
import { useNavigate } from "react-router-dom"
import useLoginStore from "@/Stores/LoginStore"

const TVMainMedia = ({ media }: { media: HomeMedias["main_media"] }) => {
    const playerRef = useRef<HTMLVideoElement>(null)

    const navigate = useNavigate();
    const { updateProfileData, updateAccessToken } = useLoginStore();

    useEffect(() => {
        let url = `${import.meta.env.VITE_API_URL}/api/watch/live-tv/${media.id}`

        if (playerRef.current && url) {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    xhrSetup: (xhr, url) => {
                        xhr.open("GET", url, true);

                        if (url.includes(import.meta.env.VITE_API_URL)) {
                            xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('access_token')}`);
                            xhr.setRequestHeader("X-Current-Time", String(playerRef.current?.currentTime || 0));
                        }

                        xhr.onreadystatechange = async () => {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                try {
                                    const response = JSON.parse(xhr.responseText);
                                    if (response.code === 246) {
                                        const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                                            method: "POST",
                                            body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        });

                                        const refreshData = await refreshRes.json();

                                        if (refreshData.error) {
                                            navigate("/login");
                                            return;
                                        } else {
                                            let access_token = refreshData.data.access_token;
                                            localStorage.setItem("access_token", access_token);
                                            updateAccessToken(refreshData.data.access_token);
                                            updateProfileData(refreshData.data.user);

                                            xhr.open("GET", url, true);
                                            if (url.includes(import.meta.env.VITE_API_URL)) {
                                                xhr.setRequestHeader("Authorization", `Bearer ${access_token}`);
                                                xhr.setRequestHeader("X-Current-Time", String(playerRef.current?.currentTime || 0));
                                            }
                                            xhr.send();
                                        }
                                    }
                                } catch (error) {
                                    console.error(`Error parsing response: ${error}`);
                                }
                            }
                        }
                    }
                });
                hls.loadSource(url);
                hls.attachMedia(playerRef.current);

            }
        }
    }, [media])

    return (
        <section className="h-[75dvh] bg-cover bg-center flex items-end relative">
            <section className="absolute top-0 left-0 w-full h-full" onClick={() => { navigate(`/watch/${media.type}/${media.id}`) }}>
                <video ref={playerRef} className="w-full h-full object-cover" autoPlay muted loop />
            </section>
            <section className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[--black] via-transparent to-[--black] bg-opacity-50 pointer-events-none"></section>
            <section className="px-4 flex flex-col gap-4 w-3/4 z-10">
                {media.have_logo ? (<img src={media.images.logo} alt={media.title} className="h-48 object-contain rounded-md w-fit" />) : <h1 className="text-5xl font-bold">{media.serie_title ?? media.title}</h1>}
                <p>{media.description}</p>
                <section className="flex gap-4">
                    <Button to={`/watch/${media.type}/${media.id}`} iconBefore={<GoPlay />} state="primary">Watch Now</Button>
                </section>
            </section>
        </section >
    )
}

export default TVMainMedia