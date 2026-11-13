import React from 'react';
import { Camera, X } from 'lucide-react';
import { Language, NightState } from '../types/game';
import { getTranslations } from '../i18n/translations';

interface CCTVOverlayProps {
  nightState: NightState;
  onSwitchCam: (camId: number) => void;
  onExit: () => void;
  language: Language;
}

export const CCTVOverlay: React.FC<CCTVOverlayProps> = ({
  nightState,
  onSwitchCam,
  onExit,
  language,
}) => {
  const t = getTranslations(language).cctv;
  const cameras = t.cameras;
  const currentCam = cameras.find((c) => c.id === nightState.cctvActiveCam) || cameras[0];

  return (
    <div className="absolute inset-0 pointer-events-auto bg-black/40 font-mono text-white select-none flex flex-col justify-between p-6">
      {/* Heavy CRT scanline and vignette overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* TOP HEADER */}
      <div className="relative z-10 flex items-center justify-between border-b border-neutral-700/80 pb-3 bg-neutral-950/80 px-4 py-2 rounded">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          <span className="font-bold tracking-widest text-red-500 text-sm">{t.rec}</span>
          <span className="text-neutral-400 text-xs">{t.header}</span>
        </div>

        <div className="text-sm font-bold text-emerald-400 tracking-wider">
          {t.live}: {currentCam.name} — {currentCam.label}
        </div>

        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-600/60 rounded text-xs text-red-200 cursor-pointer font-bold transition-colors"
        >
          <X className="w-4 h-4" />
          {t.exitOffice}
        </button>
      </div>

      {/* CENTER GLITCH HINT */}
      <div className="relative z-10 self-center pointer-events-none text-neutral-500 text-xs tracking-widest uppercase">
        {nightState.night === 2 ? t.anomalies : t.signal}
      </div>

      {/* BOTTOM CAMERA SELECTOR DOCK */}
      <div className="relative z-10 bg-neutral-950/90 border border-neutral-800 rounded-lg p-3 max-w-3xl mx-auto w-full shadow-2xl">
        <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-2 flex items-center justify-between">
          <span>{t.matrixTitle}</span>
          <span className="text-neutral-500">{t.switchHint}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {cameras.map((cam) => {
            const isActive = cam.id === nightState.cctvActiveCam;
            return (
              <button
                key={cam.id}
                onClick={() => onSwitchCam(cam.id)}
                className={`flex flex-col text-left p-2.5 rounded border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                    : 'bg-neutral-900/80 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs">{cam.name}</span>
                  <Camera className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                </div>
                <span className="text-[10px] leading-tight text-neutral-400 truncate">{cam.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
