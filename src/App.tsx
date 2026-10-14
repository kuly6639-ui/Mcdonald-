import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import {
  GameNight,
  GameScreen,
  GameSettings,
  ObjectiveStep,
  PlayerStats,
  NightState,
} from './types/game';
import { LoadingScreen } from './components/LoadingScreen';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { CCTVOverlay } from './components/CCTVOverlay';
import { PauseMenu } from './components/PauseMenu';
import { VictoryModal } from './components/VictoryModal';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [currentScreen, setCurrentScreen] = useState<GameScreen>('loading');
  const [isPaused, setIsPaused] = useState(false);
  const [night2Unlocked, setNight2Unlocked] = useState(() => {
    return localStorage.getItem('mcd_night2_unlocked') === 'true';
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('mcd_nightfall_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return {
      masterVolume: 0.8,
      mouseSensitivity: 1.2,
      invertY: false,
      crtFilter: true,
      graphicsQuality: 'high',
    };
  });

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    stamina: 100,
    isSprinting: false,
    isCrouched: false,
    flashlightOn: true,
    hasTrashInHand: false,
    hasCardboardInHand: false,
  });

  const [nightState, setNightState] = useState<NightState>({
    night: 1,
    timeHour: 0,
    timeMinute: 0,
    timeTotalSeconds: 0,
    currentObjectiveIndex: 0,
    objectiveCompletedBanner: null,
    tablesCleaned: 0,
    trashCollected: 0,
    trashDumped: false,
    kitchenShutDown: false,
    storageInspected: false,
    clockedIn: false,
    freezerLogged: false,
    hallwayMopped: false,
    cardboardDumped: false,
    driveThruInspected: false,
    cctvActiveCam: 1,
    slidingDoorOpenAmount: 0,
    rearDoorOpenAmount: 0,
    teaserStep: 0,
  });

  const [activeObjective, setActiveObjective] = useState<ObjectiveStep | null>(null);
  const [objectiveCompletedNotice, setObjectiveCompletedNotice] = useState<string | null>(null);
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new GameEngine(canvasMountRef.current, {
      onScreenChange: (screen) => {
        setCurrentScreen(screen);
        if (screen === 'night1_complete') {
          setNight2Unlocked(true);
          localStorage.setItem('mcd_night2_unlocked', 'true');
        }
      },
      onActiveObjectiveUpdate: (step) => setActiveObjective(step),
      onObjectiveCompletedNotice: (notice) => setObjectiveCompletedNotice(notice),
      onPlayerStatsUpdate: (stats) => setPlayerStats(stats),
      onNightStateUpdate: (state) => setNightState(state),
      onInteractionPrompt: (prompt) => setInteractionPrompt(prompt),
    });

    engine.updateSettings(settings);
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const handleStartNight = (night: GameNight) => {
    setIsPaused(false);
    engineRef.current?.startNight(night);
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('mcd_nightfall_settings', JSON.stringify(updated));
      engineRef.current?.updateSettings(updated);
      return updated;
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    engineRef.current?.togglePause();
  };

  const handleRestartNight = () => {
    setIsPaused(false);
    engineRef.current?.startNight(nightState.night);
  };

  const handleMainMenu = () => {
    setIsPaused(false);
    engineRef.current?.setScreen('menu');
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
    engineRef.current?.togglePause();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 3D WebGL Canvas */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0" />

      {/* Retro CRT Scanline Filter */}
      {settings.crtFilter && (
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[length:100%_4px]" />
      )}

      {/* Horror Loading Screen */}
      {currentScreen === 'loading' && (
        <LoadingScreen onComplete={() => setCurrentScreen('menu')} />
      )}

      {/* Main Menu */}
      {currentScreen === 'menu' && (
        <MainMenu
          onStartNight={handleStartNight}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          night2Unlocked={night2Unlocked}
        />
      )}

      {/* Active Playing HUD */}
      {currentScreen === 'playing' && !isPaused && (
        <HUD
          stats={playerStats}
          nightState={nightState}
          activeObjective={activeObjective}
          objectiveCompletedNotice={objectiveCompletedNotice}
          interactionPrompt={interactionPrompt}
          onPauseClick={handleTogglePause}
        />
      )}

      {/* CCTV Security Cameras View */}
      {currentScreen === 'cctv' && !isPaused && (
        <CCTVOverlay
          nightState={nightState}
          onSwitchCam={(camId) => engineRef.current?.switchCCTV(camId)}
          onExit={() => engineRef.current?.exitCCTV()}
        />
      )}

      {/* Pause Menu Modal */}
      {isPaused && currentScreen === 'playing' && (
        <PauseMenu
          onResume={handleResume}
          onRestartNight={handleRestartNight}
          onMainMenu={handleMainMenu}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      )}

      {/* Night 1 Ending & Night 2 Teaser Ending */}
      {(currentScreen === 'night1_complete' || currentScreen === 'night2_teaser') && (
        <VictoryModal
          night={currentScreen === 'night1_complete' ? 1 : 2}
          onProceedToNight2={() => handleStartNight(2)}
          onPlayAgain={() => handleStartNight(1)}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}
