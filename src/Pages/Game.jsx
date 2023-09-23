import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const injectScripts = (core, rom_path, bios) => {
  if (window.EJS_emulator || window.EmulatorJS) return;
  window.EJS_player = '#game';
  window.EJS_core = core;
  window.EJS_gameUrl = rom_path;

  if (bios) {
    window.EJS_biosUrl = 'path_to_bios';
  }
  
  const script = document.createElement('script');
  script.src = "https://www.emulatorjs.com/loader.js";
  document.body.appendChild(script);
}

export default function Game() {
  const { console, id } = useParams();
  const [core, setCore] = useState(null);
  const [rom_path, setRomPath] = useState(null);
  const [bios, setBios] = useState(null);

  useEffect(() => {
    const cores = {
      GB: 'gambatte',
      GBA: 'mgba',
      GBC: 'mgba',
      N64: 'mupen64plus_next',
      NES: 'nes',
      NDS: 'melonds',
      SNES: 'snes9x',
      "Sega Mega Drive": 'genesis_plus_gx',
      "Sega Master System": 'genesis_plus_gx',
      "Sega Saturn": 'yabause',
      PS1: 'pcsx_rearmed',
    }
    
    const bioses = {
      GB: null,
      GBA: null,
      GBC: null,
      N64: null,
      NES: null,
      NDS: `${process.env.REACT_APP_DEV_URL}/bios/NDS`,
      SNES: null,
      "Sega Mega Drive": null,
      "Sega Master System": null,
      "Sega Saturn": null,
      PS1: `${process.env.REACT_APP_DEV_URL}/bios/PS1`
    }

    let core = cores[console];
    setCore(core);
    setRomPath(`${process.env.REACT_APP_DEV_URL}/game_file/${id}`)

    if (bioses[console]) {
      setBios(bioses[console]);
    } else {
      setBios(null);
    }
  }, [console, id]);


  return (
    <>
      {core && rom_path && injectScripts(core, rom_path, bios)}
      <div className="game" id="game"></div>
    </>
  );
}
