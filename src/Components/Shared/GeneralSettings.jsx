import { useState, useEffect } from 'react'

import { Dropdown } from './Dropdown';
import Buttons from "./Buttons";

import { useGet, usePost } from "../../Utils/Fetch";
import { useLangage } from '../../Utils/useLangage';

export default function AllLibraries() {
    const [language, setLanguage] = useState(undefined);

    const [tmdbApiKey, setTmdbApiKey] = useState(undefined);
    const [igdbId, setIgdbId] = useState(undefined);
    const [igdbSecret, setIgdbSecret] = useState(undefined);

    const [radarrAdress, setRadarrAdress] = useState(undefined);
    const [radarrDirectory, setRadarrDirectory] = useState(undefined);
    const [radarrApiKey, setRadarrApiKey] = useState(undefined);

    const [sonarrAdress, setSonarrAdress] = useState(undefined);
    const [sonarrDirectory, setSonarrDirectory] = useState(undefined);
    const [sonarrApiKey, setSonarrApiKey] = useState(undefined);

    const [readarrAdress, setReadarrAdress] = useState(undefined);
    const [readarrDirectory, setReadarrDirectory] = useState(undefined);
    const [readarrApiKey, setReadarrApiKey] = useState(undefined);

    const [lidarrAdress, setLidarrAdress] = useState(undefined);
    const [lidarrDirectory, setLidarrDirectory] = useState(undefined);
    const [lidarrApiKey, setLidarrApiKey] = useState(undefined);


    const { data: languageData } = useGet(`${process.env.REACT_APP_DEV_URL}/get_language`);
    const { data: settings } = useGet(`${process.env.REACT_APP_DEV_URL}/get_settings`);

    const { handleSubmit } = usePost()

    const { getLang } = useLangage();

    useEffect(() => {
        if (languageData) {
            setLanguage(languageData.language);
        }
    }, [languageData]);

    useEffect(() => {
        if (settings) {
            const ChocolateSettings = settings.ChocolateSettings;
            const APIKeys = settings.APIKeys;
            const ARRSettings = settings.ARRSettings;

            setTmdbApiKey(APIKeys.tmdb);
            setIgdbId(APIKeys.igdbid);
            setIgdbSecret(APIKeys.igdbsecret);
            setRadarrApiKey(APIKeys.radarr);
            setSonarrApiKey(APIKeys.sonarr);
            setReadarrApiKey(APIKeys.readarr);
            setLidarrApiKey(APIKeys.lidarr);

            setRadarrAdress(ARRSettings.radarrurl);
            setRadarrDirectory(ARRSettings.radarrfolder);
            setSonarrAdress(ARRSettings.sonarrurl);
            setSonarrDirectory(ARRSettings.sonarrfolder);
            setReadarrAdress(ARRSettings.readarrurl);
            setReadarrDirectory(ARRSettings.readarrfolder);
            setLidarrAdress(ARRSettings.lidarrurl);
            setLidarrDirectory(ARRSettings.lidarrfolder);

            setLanguage(ChocolateSettings.language);
        }
    }, [settings]);

    const languages = [
        { value: "AF", text: "Afrikaans"},
        { value: "SQ", text: "Albanian"},
        { value: "AM", text: "Amharic"},
        { value: "AR", text: "Arabic"},
        { value: "HY", text: "Armenian"},
        { value: "AZ", text: "Azerbaijani"},
        { value: "EU", text: "Basque"},
        { value: "BE", text: "Belarusian"},
        { value: "BN", text: "Bengali"},
        { value: "BS", text: "Bosnian"},
        { value: "BG", text: "Bulgarian"},
        { value: "CA", text: "Catalan"},
        { value: "NY", text: "Chichewa"},
        { value: "CO", text: "Corsican"},
        { value: "HR", text: "Croatian"},
        { value: "CS", text: "Czech"},
        { value: "DA", text: "Danish"},
        { value: "NL", text: "Dutch"},
        { value: "EN", text: "English"},
        { value: "EO", text: "Esperanto"},
        { value: "ET", text: "Estonian"},
        { value: "FI", text: "Finnish"},
        { value: "FR", text: "French"},
        { value: "FY", text: "Frisian"},
        { value: "GL", text: "Galician"},
        { value: "KA", text: "Georgian"},
        { value: "DE", text: "German"},
        { value: "EL", text: "Greek"},
        { value: "GU", text: "Gujarati"},
        { value: "HT", text: "Haitian Creole"},
        { value: "HA", text: "Hausa"},
        { value: "HE", text: "Hebrew"},
        { value: "HI", text: "Hindi"},
        { value: "HU", text: "Hungarian"},
        { value: "IS", text: "Icelandic"},
        { value: "IG", text: "Igbo"},
        { value: "ID", text: "Indonesian"},
        { value: "GA", text: "Irish"},
        { value: "IT", text: "Italian"},
        { value: "JA", text: "Japanese"},
        { value: "JV", text: "Javanese"},
        { value: "KN", text: "Kannada"},
        { value: "KK", text: "Kazakh"},
        { value: "KM", text: "Khmer"},
        { value: "KO", text: "Korean"},
        { value: "KU", text: "Kurdish (Kurmanji)"},
        { value: "LO", text: "Lao"},
        { value: "LA", text: "Latin"},
        { value: "LV", text: "Latvian"},
        { value: "LT", text: "Lithuanian"},
        { value: "LB", text: "Luxembourgish"},
        { value: "MK", text: "Macedonian"},
        { value: "MG", text: "Malagasy"},
        { value: "MS", text: "Malay"},
        { value: "ML", text: "Malayalam"},
        { value: "MT", text: "Maltese"},
        { value: "ZH", text: "Mandarin"},
        { value: "MI", text: "Maori"},
        { value: "MR", text: "Marathi"},
        { value: "MN", text: "Mongolian"},
        { value: "NE", text: "Nepali"},
        { value: "NO", text: "Norwegian"},
        { value: "PS", text: "Pashto"},
        { value: "FA", text: "Persian"},
        { value: "PL", text: "Polish"},
        { value: "PT", text: "Portuguese"},
        { value: "PA", text: "Punjabi"},
        { value: "RO", text: "Romanian"},
        { value: "RU", text: "Russian"},
        { value: "SM", text: "Samoan"},
        { value: "GD", text: "Scots Gaelic"},
        { value: "SR", text: "Serbian"},
        { value: "SN", text: "Shona"},
        { value: "SD", text: "Sindhi"},
        { value: "SK", text: "Slovak"},
        { value: "SL", text: "Slovenian"},
        { value: "SO", text: "Somali"},
        { value: "ES", text: "Spanish"},
        { value: "SU", text: "Sundanese"},
        { value: "SW", text: "Swahili"},
        { value: "SV", text: "Swedish"},
        { value: "TG", text: "Tajik"},
        { value: "TA", text: "Tamil"},
        { value: "TT", text: "Tatar"},
        { value: "TE", text: "Telugu"},
        { value: "TH", text: "Thai"},
        { value: "TR", text: "Turkish"},
        { value: "TK", text: "Turkmen"},
        { value: "UK", text: "Ukrainian"},
        { value: "UR", text: "Urdu"},
        { value: "UZ", text: "Uzbek"},
        { value: "VI", text: "Vietnamese"},
        { value: "CY", text: "Welsh"},
        { value: "XH", text: "Xhosa"},
        { value: "YI", text: "Yiddish"},
        { value: "YO", text: "Yoruba"},
        { value: "ZU", text: "Zulu"},
    ]

    const languagesDict = { "AF": "Afrikaans", "SQ": "Albanian", "AM": "Amharic", "AR": "Arabic", "HY": "Armenian", "AZ": "Azerbaijani", "EU": "Basque", "BE": "Belarusian", "BN": "Bengali", "BS": "Bosnian", "BG": "Bulgarian", "CA": "Catalan", "NY": "Chichewa", "CO": "Corsican", "HR": "Croatian", "CS": "Czech", "DA": "Danish", "NL": "Dutch", "EN": "English", "EO": "Esperanto", "ET": "Estonian", "FI": "Finnish", "FR": "French", "FY": "Frisian", "GL": "Galician", "KA": "Georgian", "DE": "German", "EL": "Greek", "GU": "Gujarati", "HT": "Haitian Creole", "HA": "Hausa", "HE": "Hebrew", "HI": "Hindi", "HU": "Hungarian", "IS": "Icelandic", "IG": "Igbo", "ID": "Indonesian", "GA": "Irish", "IT": "Italian", "JA": "Japanese", "JV": "Javanese", "KN": "Kannada", "KK": "Kazakh", "KM": "Khmer", "KO": "Korean", "KU": "Kurdish (Kurmanji)", "LO": "Lao", "LA": "Latin", "LV": "Latvian", "LT": "Lithuanian", "LB": "Luxembourgish", "MK": "Macedonian", "MG": "Malagasy", "MS": "Malay", "ML": "Malayalam", "MT": "Maltese", "ZH": "Mandarin", "MI": "Maori", "MR": "Marathi", "MN": "Mongolian", "NE": "Nepali", "NO": "Norwegian", "PS": "Pashto", "FA": "Persian", "PL": "Polish", "PT": "Portuguese", "PA": "Punjabi", "RO": "Romanian", "RU": "Russian", "SM": "Samoan", "GD": "Scots Gaelic", "SR": "Serbian", "SN": "Shona", "SD": "Sindhi", "SK": "Slovak", "SL": "Slovenian", "SO": "Somali", "ES": "Spanish", "SU": "Sundanese", "SW": "Swahili", "SV": "Swedish", "TG": "Tajik", "TA": "Tamil", "TT": "Tatar", "TE": "Telugu", "TH": "Thai", "TR": "Turkish", "TK": "Turkmen", "UK": "Ukrainian", "UR": "Urdu", "UZ": "Uzbek", "VI": "Vietnamese", "CY": "Welsh", "XH": "Xhosa", "YI": "Yiddish", "YO": "Yoruba", "ZU": "Zulu"}


    function handleLanguageChange(e) {
        setLanguage(e.target.value);
    }

    function handleSave() {
        const settings = {
            language: language,
            tmdbKey: tmdbApiKey,
            igdbID: igdbId,
            igdbSecret: igdbSecret,

            radarrAPI: radarrApiKey,
            radarrFolder: radarrDirectory,
            radarrAdress: radarrAdress,

            sonarrAPI: sonarrApiKey,
            sonarrFolder: sonarrDirectory,
            sonarrAdress: sonarrAdress,

            readarrAPI: readarrApiKey,
            readarrFolder: readarrDirectory,
            readarrAdress: readarrAdress,

            lidarrAPI: lidarrApiKey,
            lidarrFolder: lidarrDirectory,
            lidarrAdress: lidarrAdress,
        }
        console.log(settings);
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/save_settings`,
            body: settings
        });
    }

    return (
        <>
        <h1>General Settings</h1>
        <div className="general-settings">
            <div className="inline-flex">
                <p>Language:</p>
                <Dropdown elements={languages} setValue={setLanguage} defaultValue={language} defaultText={languagesDict[language]} onChange={handleLanguageChange} />
            </div>
            <div className="sub-settings">
                <div className="api-settings">
                    <h2>{getLang("api_keys")}</h2>
                    <div className="inline-flex">
                        <p>{getLang("tmdb_api_key")}</p>
                        <input className="input" placeholder={getLang("tmdb_api_key")} value={tmdbApiKey} onChange={e => setTmdbApiKey(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("igdb_id_key")}</p>
                        <input className="input" placeholder={getLang("igdb_id_key")} value={igdbId} onChange={e => setIgdbId(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("igdb_secret_key")}</p>
                        <input className="input" placeholder={getLang("igdb_secret_key")} value={igdbSecret} onChange={e => setIgdbSecret(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="sub-settings">
                <h2>{getLang("arr_settings")}</h2>
                <div className="arr-settings">
                    <h3>Radarr</h3>
                    <div className="inline-flex">
                        <p>{getLang("radarr_adress")}</p>
                        <input className="input" placeholder={getLang("radarr_adress")} value={radarrAdress} onChange={e => setRadarrAdress(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("radarr_folder")}</p>
                        <input className="input" placeholder={getLang("radarr_folder")} value={radarrDirectory} onChange={e => setRadarrDirectory(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("radarr_api_key")}</p>
                        <input className="input" placeholder={getLang("radarr_api_key")} value={radarrApiKey} onChange={e => setRadarrApiKey(e.target.value)} />
                    </div>
                </div>
                <div className="arr-settings">
                    <h3>Sonarr</h3>
                    <div className="inline-flex">
                        <p>{getLang("sonarr_adress")}</p>
                        <input className="input" placeholder={getLang("sonarr_adress")} value={sonarrAdress} onChange={e => setSonarrAdress(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("sonarr_folder")}</p>
                        <input className="input" placeholder={getLang("sonarr_folder")} value={sonarrDirectory} onChange={e => setSonarrDirectory(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("sonarr_api_key")}</p>
                        <input className="input" placeholder={getLang("sonarr_api_key")} value={sonarrApiKey} onChange={e => setSonarrApiKey(e.target.value)} />
                    </div>
                </div>
                <div className="arr-settings">
                    <h3>Readarr</h3>
                    <div className="inline-flex">
                        <p>{getLang("readarr_adress")}</p>
                        <input className="input" placeholder={getLang("readarr_adress")} value={readarrAdress} onChange={e => setReadarrAdress(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("readarr_folder")}</p>
                        <input className="input" placeholder={getLang("readarr_folder")} value={readarrDirectory} onChange={e => setReadarrDirectory(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("readarr_api_key")}</p>
                        <input className="input" placeholder={getLang("readarr_api_key")} value={readarrApiKey} onChange={e => setReadarrApiKey(e.target.value)} />
                    </div>
                </div>
                <div className="arr-settings">
                    <h3>Lidarr</h3>
                    <div className="inline-flex">
                        <p>{getLang("lidarr_adress")}</p>
                        <input className="input" placeholder={getLang("lidarr_adress")} value={lidarrAdress} onChange={e => setLidarrAdress(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("lidarr_folder")}</p>
                        <input className="input" placeholder={getLang("lidarr_folder")} value={lidarrDirectory} onChange={e => setLidarrDirectory(e.target.value)} />
                    </div>
                    <div className="inline-flex">
                        <p>{getLang("lidarr_api_key")}</p>
                        <input className="input" placeholder={getLang("lidarr_api_key")} value={lidarrApiKey} onChange={e => setLidarrApiKey(e.target.value)} />
                    </div>
                </div>
            </div>
            <Buttons text={getLang("save_settings")} onClick={handleSave} />
        </div>
        </>
    );
}
