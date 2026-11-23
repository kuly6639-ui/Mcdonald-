import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import {
  GameNight,
  GameScreen,
  GameSettings,
  ObjectiveStep,
  PlayerStats,
  NightState,
  DialogueState,
  Night3EmergencyProgress,
} from './types/game';
import { WarningScreen } from './components/WarningScreen';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { CCTVOverlay } from './components/CCTVOverlay';
import { PauseMenu } from './components/PauseMenu';
import { VictoryModal } from './components/VictoryModal';
import { DialogueBox } from './components/DialogueBox';
import { DuckChatBar } from './components/DuckChatBar';
import { MobileControls } from './components/MobileControls';
import { Night3EndingScreen } from './components/Night3EndingScreen';
import { PhoneOverlay } from './components/PhoneOverlay';
import { Night3CarChoiceModal } from './components/Night3CarChoiceModal';

function safeGetStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage restriction inside sandboxed/third-party iframes
  }
}

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [currentScreen, setCurrentScreen] = useState<GameScreen>('warning');
  const [isPaused, setIsPaused] = useState(false);
  const [night2Unlocked, setNight2Unlocked] = useState(() => {
    return safeGetStorage('mcd_night2_unlocked') === 'true';
  });
  const [night3Unlocked, setNight3Unlocked] = useState(() => {
    return safeGetStorage('mcd_night3_unlocked') === 'true';
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    const defaults: GameSettings = {
      masterVolume: 0.8,
      mouseSensitivity: 1.2,
      invertY: false,
      crtFilter: true,
      graphicsQuality: 'high',
      language: 'en',
    };
    try {
      const saved = safeGetStorage('mcd_nightfall_settings');
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
    } catch (e) {
      // Ignore
    }
    return defaults;
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
  const [dialogue, setDialogue] = useState<DialogueState>({
    active: false,
    isMonologue: false,
    lines: [],
    currentIndex: 0,
  });
  const [fadeAlpha, setFadeAlpha] = useState<number>(0);
  const [whiteFlashAlpha, setWhiteFlashAlpha] = useState<number>(0);
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [phonePhotos, setPhonePhotos] = useState<string[]>([]);
  const [night3Emergency, setNight3Emergency] = useState<Night3EmergencyProgress>({
    phase: 'none',
    calledPolice: false,
    textedJohn: false,
  });
  const [showMobileControls, setShowMobileControls] = useState<boolean>(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  // Automatically hide mobile controls when physical keyboard or mouse input is detected
  useEffect(() => {
    const handleKeyDown = () => {
      setShowMobileControls(false);
    };

    let mouseCount = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.abs(e.movementX) > 2 || Math.abs(e.movementY) > 2) {
        mouseCount++;
        if (mouseCount > 2) {
          setShowMobileControls(false);
        }
      }
    };

    const handleTouchStart = () => {
      setShowMobileControls(true);
      mouseCount = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new GameEngine(canvasMountRef.current, {
      onScreenChange: (screen) => {
        setCurrentScreen(screen);
        if (screen === 'night1_complete') {
          setNight2Unlocked(true);
          safeSetStorage('mcd_night2_unlocked', 'true');
        } else if (screen === 'night2_complete') {
          setNight3Unlocked(true);
          safeSetStorage('mcd_night3_unlocked', 'true');
        }
      },
      onActiveObjectiveUpdate: (step) => setActiveObjective(step),
      onObjectiveCompletedNotice: (notice) => setObjectiveCompletedNotice(notice),
      onPlayerStatsUpdate: (stats) => setPlayerStats(stats),
      onNightStateUpdate: (state) => setNightState(state),
      onInteractionPrompt: (prompt) => setInteractionPrompt(prompt),
      onDialogueUpdate: (d) => setDialogue(d),
      onFadeAlphaUpdate: (alpha) => setFadeAlpha(alpha),
      onWhiteFlashAlphaUpdate: (alpha) => setWhiteFlashAlpha(alpha),
      onNight3CarPhaseChange: (progress) => {
        setNight3Emergency(progress);
        if (progress.phase === 'choice' || progress.phase === 'bad_ending_caught') {
          setIsPhoneOpen(false);
        }
      },
      onPhoneToggleRequested: () => {
        setIsPhoneOpen((prev) => {
          const next = !prev;
          engine.setPhoneOpen(next);
          return next;
        });
      },
    });

    engine.updateSettings(settings);
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const handleTogglePhone = () => {
    setIsPhoneOpen((prev) => {
      const next = !prev;
      engineRef.current?.setPhoneOpen(next);
      return next;
    });
  };

  const handleClosePhone = () => {
    setIsPhoneOpen(false);
    engineRef.current?.setPhoneOpen(false);
  };

  const handleCapturePhonePhoto = () => {
    const shot = engineRef.current?.capturePhoneSnapshot();
    if (shot) {
      setPhonePhotos((prev) => [shot, ...prev].slice(0, 12));
    }
  };

  const handleStartNight = (night: GameNight) => {
    setIsPaused(false);
    setIsPhoneOpen(false);
    setNight3Emergency({ phase: 'none', calledPolice: false, textedJohn: false });
    engineRef.current?.startNight(night);
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      safeSetStorage('mcd_nightfall_settings', JSON.stringify(updated));
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
    setIsPhoneOpen(false);
    setNight3Emergency({ phase: 'none', calledPolice: false, textedJohn: false });
    engineRef.current?.startNight(nightState.night);
  };

  const handleMainMenu = () => {
    setIsPaused(false);
    setIsPhoneOpen(false);
    setNight3Emergency({ phase: 'none', calledPolice: false, textedJohn: false });
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

      {/* Health, Heart & Flashing Light Warning Screen */}
      {currentScreen === 'warning' && (
        <WarningScreen
          onComplete={() => {
            engineRef.current?.setScreen('menu');
            setCurrentScreen('menu');
          }}
          language={settings.language}
        />
      )}

      {/* Main Menu */}
      {currentScreen === 'menu' && (
        <MainMenu
          onStartNight={handleStartNight}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          night2Unlocked={night2Unlocked}
          night3Unlocked={night3Unlocked}
        />
      )}

      {/* Cinematic Scene Fade-in from Black */}
      {fadeAlpha > 0.001 && currentScreen === 'playing' && (
        <div
          className="absolute inset-0 pointer-events-none z-30 bg-black transition-opacity duration-75"
          style={{ opacity: fadeAlpha }}
        />
      )}

      {/* Night 3 Clown Catch White-Flash Impact Overlay */}
      {whiteFlashAlpha > 0.002 && currentScreen === 'playing' && (
        <div
          className="absolute inset-0 pointer-events-none z-40 bg-white"
          style={{ opacity: whiteFlashAlpha }}
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
          onPhoneClick={handleTogglePhone}
          isPhoneOpen={isPhoneOpen}
          language={settings.language}
        />
      )}

      {/* Handheld Phone Interface (Toggleable via [P] or HUD button, auto-opened in Night 3 car hide) */}
      {currentScreen === 'playing' && !isPaused && isPhoneOpen && night3Emergency.phase !== 'choice' && (
        <PhoneOverlay
          nightState={nightState}
          language={settings.language}
          emergency={night3Emergency}
          photos={phonePhotos}
          onCapturePhoto={handleCapturePhonePhoto}
          onEmergencyAction={(action) => engineRef.current?.completeNight3EmergencyAction(action)}
          onClose={handleClosePhone}
        />
      )}

      {/* Night 3 Car Climax Choice Modal */}
      {currentScreen === 'playing' && !isPaused && night3Emergency.phase === 'choice' && (
        <Night3CarChoiceModal
          language={settings.language}
          onChooseExitCar={() => engineRef.current?.chooseNight3CarExit()}
          onChooseHideInCar={() => engineRef.current?.chooseNight3CarHideAndCallHelp()}
        />
      )}

      {/* Duck's Monologue Chat Bar (Appears when game fades or during internal reflection) */}
      {currentScreen === 'playing' && dialogue.active && dialogue.isMonologue && (
        <DuckChatBar
          text={dialogue.lines[dialogue.currentIndex]?.text || ''}
          speaker={dialogue.lines[dialogue.currentIndex]?.speaker || 'Duck'}
          onAdvance={() => engineRef.current?.advanceDialogue()}
          isFadedOut={fadeAlpha > 0.05}
          isMobileLayout={showMobileControls}
          language={settings.language}
        />
      )}

      {/* Compact Customer Dialogue HUD */}
      {currentScreen === 'playing' && dialogue.active && !dialogue.isMonologue && !isPaused && (
        <DialogueBox
          dialogue={dialogue}
          onAdvance={() => engineRef.current?.advanceDialogue()}
          isMobileLayout={showMobileControls}
          language={settings.language}
        />
      )}

      {/* Auto-Detected Mobile Touch Controls */}
      {currentScreen === 'playing' && !isPaused && !isPhoneOpen && night3Emergency.phase !== 'choice' && (
        <MobileControls
          engine={engineRef.current}
          stats={playerStats}
          night={nightState.night}
          onPause={handleTogglePause}
          onPhone={handleTogglePhone}
          isPhoneOpen={isPhoneOpen}
          showMobileControls={showMobileControls}
          language={settings.language}
        />
      )}

      {/* CCTV Security Cameras View */}
      {currentScreen === 'cctv' && !isPaused && (
        <CCTVOverlay
          nightState={nightState}
          onSwitchCam={(camId) => engineRef.current?.switchCCTV(camId)}
          onExit={() => engineRef.current?.exitCCTV()}
          language={settings.language}
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

      {/* Night 1 & Night 2 Shift Completion Screens */}
      {(currentScreen === 'night1_complete' || currentScreen === 'night2_complete') && (
        <VictoryModal
          night={currentScreen === 'night1_complete' ? 1 : 2}
          onProceedToNight2={() => handleStartNight(2)}
          onProceedToNight3={() => handleStartNight(3)}
          onPlayNight2Again={() => handleStartNight(2)}
          onPlayAgain={() => handleStartNight(1)}
          onMainMenu={handleMainMenu}
          language={settings.language}
        />
      )}

      {/* Night 3 Pure Black Ending Sequence (Good or Bad Ending) -> Demo Over & Credits (never flashes menu) */}
      {(currentScreen === 'night3_ending' ||
        currentScreen === 'night3_bad_ending' ||
        currentScreen === 'credits') && (
        <Night3EndingScreen
          onReturnToMenu={handleMainMenu}
          language={settings.language}
          variant={currentScreen === 'night3_bad_ending' ? 'bad' : 'good'}
        />
      )}
    </div>
  );
}
