import Button from "@/Components/Button";
import Loading from "@/Components/Loading";
import { useGet, usePost } from "@/Hooks/useFetch";
import React, { useEffect, useState } from 'react';

interface Language {
    code: string;
    name: string;
}

const GeneralSettings: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const [language, setLanguage] = useState<string>('');
    const [tmdbApiKey, setTmdbApiKey] = useState<string>('');
    const [igdbIdKey, setIgdbIdKey] = useState<string>('');
    const [igdbSecretKey, setIgdbSecretKey] = useState<string>('');
    const [allowDownloads, setAllowDownloads] = useState<boolean>(false);


    const { handleSubmit } = usePost();

    const onSubmit = async () => {
        const data = {
            ChocolateSettings: {
                language: language,
                allowdownload: allowDownloads,
            },
            APIKeys: {
                tmdb: tmdbApiKey,
                igdbid: igdbIdKey,
                igdbsecret: igdbSecretKey,
            },
        };

        await handleSubmit({
            url: '/api/settings/general',
            body: data,
        });
    }

    const { data: settingsData, loading: settingsLoading } = useGet('/api/settings/general');
    const { data: languages, loading: languageLoading } = useGet('/api/settings/languages');

    useEffect(() => {
        setLoading(settingsLoading && languageLoading);
    }, [settingsLoading, languageLoading]);

    useEffect(() => {
        if (settingsData && settingsData.data && settingsData.data.ChocolateSettings && settingsData.data.APIKeys) {
            setLanguage(settingsData.data.ChocolateSettings.language);
            setAllowDownloads(settingsData.data.ChocolateSettings.allowdownload === 'true');
            setTmdbApiKey(settingsData.data.APIKeys.tmdb);
            setIgdbIdKey(settingsData.data.APIKeys.igdbid);
            setIgdbSecretKey(settingsData.data.APIKeys.igdbsecret);
        }
    }, [settingsData]);

    return (
        <>
            {<Loading className={"w-3/4 h-screen top-0 fixed bg-[--black] transition-all duration-300 pointer-events-none z-50 " + (loading ? "opacity-100" : "opacity-0")} />}
            <h2 className={`text-xl font-bold mb-4 ${loading ? 'hidden' : ''}`}>General Settings</h2>
            <div className={`flex flex-col items-start gap-6 px-8 ${loading ? 'hidden' : ''}`}>
                <div className="w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Settings</h2>
                    <div className="mb-4">
                        <label htmlFor="language-select" className="block mb-2">Language:</label>
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        >
                            {languages && languages.data && languages.data.map((lang: Language) => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4 flex items-center gap-4">
                        <label htmlFor="allow-downloads" className="block">Allow Downloads:</label>
                        <input
                            type="checkbox"
                            id="allow-downloads"
                            checked={allowDownloads}
                            onChange={(e) => setAllowDownloads(e.target.checked)}
                            className="w-4 h-4 rounded-lg bg-neutral-900 border-0 outline-none ring-0 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        />
                    </div>
                </div>

                <div className="w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">API Keys</h2>
                    <div className="mb-4">
                        <label htmlFor="tmdb-api-key" className="block mb-2">TMDB API Key:</label>
                        <input
                            type="text"
                            id="tmdb-api-key"
                            value={tmdbApiKey}
                            onChange={(e) => setTmdbApiKey(e.target.value)}
                            placeholder="afa...fdp"
                            className="w-full px-4 py-2 rounded-lg bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="igdb-id-key" className="block mb-2">IGDB ID Key:</label>
                        <input
                            type="text"
                            id="igdb-id-key"
                            value={igdbIdKey}
                            onChange={(e) => setIgdbIdKey(e.target.value)}
                            placeholder="161...b3f"
                            className="w-full px-4 py-2 rounded-lg bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="igdb-secret-key" className="block mb-2">IGDB Secret Key:</label>
                        <input
                            type="password"
                            id="igdb-secret-key"
                            autoComplete="new-password"
                            value={igdbSecretKey}
                            onChange={(e) => setIgdbSecretKey(e.target.value)}
                            placeholder="161...b3f"
                            className="w-full px-4 py-2 rounded-lg bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        />
                    </div>
                </div>
                <Button state="primary" onClick={onSubmit}>
                    Save Settings
                </Button>
            </div>
        </>
    );
};

export default GeneralSettings;