import { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Game() {
  const { console, id } = useParams();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);

  const gameFile = `${process.env.REACT_APP_DEV_URL}/game_file/${id}`;

  useLayoutEffect(() => {
    const scripts = {
      GB: 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "gb";',
      GBA: 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "gba";',
      GBC: 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "gb";',
      N64: 'let EJS_player = "#game";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "n64";',
      NES: 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "nes";\nEJS_lightgun = false;',
      NDS: 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "nds";',
      SNES: 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "snes";\nEJS_mouse = false;\nEJS_multitap = false;',
      "Sega Mega Drive": 'let EJS_player = "#game";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "segaMD";',
      "Sega Master System": 'let EJS_player = "#game";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "segaMS";',
      "Sega Saturn": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "segaSaturn";',
      PS1: 'let EJS_player = "#game";\nlet EJS_biosUrl = "{bios}";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "psx";',
    };

    let theConsole = scripts[console].replace("{slug}", gameFile);

    if (theConsole.includes("{bios}")) {
      let bios = `${process.env.REACT_APP_DEV_URL}/bios/${console}`;
      theConsole = theConsole.replace("{bios}", bios);
    }

    const script = document.createElement('script');
    script.innerHTML = theConsole;
    script.defer = true;
    script.id = 'gameScript';
    script.type = 'text/javascript';

    const emulatorJSScript = document.createElement('script');
    emulatorJSScript.src = 'https://www.emulatorjs.com/loader.js';
    emulatorJSScript.defer = true;
    emulatorJSScript.id = 'emulatorScript';

    const loadEmulator = () => {
      const gameScript = document.getElementById('gameScript');
      const emulatorScript = document.getElementById('emulatorScript');

      if (!gameScript) {
        document.body.appendChild(script);
      }

      if (!emulatorScript) {
        document.body.appendChild(emulatorJSScript);
      }

      setScriptLoaded(true);
    };

    if (!scriptLoaded) {
      loadEmulator();
    }
  }, [console, gameFile, scriptLoaded]);

  useLayoutEffect(() => {
    if (reloadPage) {
      setReloadPage(false);
      window.location.reload();
    }
  }, [reloadPage]);

  const handleReloadPage = () => {
    setReloadPage(true);
  };

  return (
    <>
      <div className="game" id="game"></div>
      <button onClick={handleReloadPage} className="button reload-button">Reload Page</button>
    </>
  );
}
