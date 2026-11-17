import React, { useEffect, useRef, useState } from 'react';
import {
  Phone,
  MessageSquare,
  Camera,
  ChevronLeft,
  X,
  PhoneCall,
  Send,
  ShieldAlert,
  Wifi,
  BatteryCharging,
  CheckCircle2,
} from 'lucide-react';
import { Language, Night3EmergencyProgress, NightState } from '../types/game';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface PhoneOverlayProps {
  nightState: NightState;
  language: Language;
  emergency: Night3EmergencyProgress;
  photos: string[];
  onCapturePhoto: () => void;
  onEmergencyAction: (action: 'police' | 'john') => void;
  onClose: () => void;
}

type PhoneTab = 'home' | 'calls' | 'messages' | 'camera';
type ContactKey = 'mom' | 'landlord' | 'john';

export const PhoneOverlay: React.FC<PhoneOverlayProps> = ({
  nightState,
  language,
  emergency,
  photos,
  onCapturePhoto,
  onEmergencyAction,
  onClose,
}) => {
  const t = getTranslations(language).phone;
  const [tab, setTab] = useState<PhoneTab>('home');
  const [activeCall, setActiveCall] = useState<'mom' | 'landlord' | 'police' | null>(null);
  const [callState, setCallState] = useState<'idle' | 'dialing' | 'connected'>('idle');
  const [activeThread, setActiveThread] = useState<ContactKey | null>(null);
  const [johnReplied, setJohnReplied] = useState(emergency.textedJohn);
  const callTimerRef = useRef<number | null>(null);
  const replyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (emergency.textedJohn) {
      setJohnReplied(true);
    }
  }, [emergency.textedJohn]);

  useEffect(() => {
    return () => {
      if (callTimerRef.current) window.clearTimeout(callTimerRef.current);
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    };
  }, []);

  const hourDisplay = nightState.timeHour === 0 ? 12 : nightState.timeHour;
  const minuteDisplay =
    nightState.timeMinute < 10 ? `0${nightState.timeMinute}` : nightState.timeMinute;
  const timeString = `${hourDisplay}:${minuteDisplay} AM`;

  const isEmergencyActive =
    emergency.phase === 'hiding_using_phone' || emergency.phase === 'police_dispatched';

  const startCall = (target: 'mom' | 'landlord' | 'police') => {
    if (callTimerRef.current) window.clearTimeout(callTimerRef.current);
    setActiveCall(target);
    setCallState('dialing');
    soundEngine.playPhoneRing();
    callTimerRef.current = window.setTimeout(() => {
      setCallState('connected');
      soundEngine.playDialogueBlip();
      if (target === 'police' && isEmergencyActive && !emergency.calledPolice) {
        onEmergencyAction('police');
      }
    }, 950);
  };

  const handleSendEmergencyText = () => {
    if (emergency.textedJohn) return;
    soundEngine.playTextMessagePing();
    onEmergencyAction('john');
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = window.setTimeout(() => {
      setJohnReplied(true);
      soundEngine.playTextMessagePing();
    }, 700);
  };

  const getCallTargetName = (target: 'mom' | 'landlord' | 'police') => {
    if (target === 'mom') return t.contacts.mom;
    if (target === 'landlord') return t.contacts.landlord;
    return t.contacts.police;
  };

  const getCallTranscript = (target: 'mom' | 'landlord' | 'police') => {
    if (target === 'mom') return t.callsTab.momLine;
    if (target === 'landlord') return t.callsTab.landlordLine;
    return isEmergencyActive ? t.callsTab.policeReady : t.callsTab.policeIdle;
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-end sm:items-center justify-center sm:justify-end p-3 sm:p-8 font-mono select-none">
      <div className="pointer-events-auto w-full max-w-[330px] rounded-[28px] bg-neutral-950 border-2 border-neutral-700 shadow-[0_24px_60px_rgba(0,0,0,0.92)] overflow-hidden flex flex-col">
        {/* Top Phone Speaker & Status Bar */}
        <div className="bg-neutral-900/95 px-4 pt-2.5 pb-2 border-b border-neutral-800">
          <div className="flex items-center justify-between text-[10px] text-neutral-300 font-bold">
            <span className="flex items-center gap-1 text-emerald-400">
              <Wifi className="w-3 h-3" />
              {t.carrier}
            </span>
            <span className="text-amber-300 tabular-nums tracking-wider">{timeString}</span>
            <span className="flex items-center gap-1 text-neutral-400">
              74%
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            {tab !== 'home' ? (
              <button
                onClick={() => {
                  soundEngine.playUICellPop();
                  if (activeThread) {
                    setActiveThread(null);
                  } else {
                    setTab('home');
                    setActiveCall(null);
                    setCallState('idle');
                  }
                }}
                className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                {t.back}
              </button>
            ) : (
              <span className="text-[11px] font-black tracking-widest text-neutral-200 uppercase">
                {t.title}
              </span>
            )}

            <button
              onClick={() => {
                soundEngine.playUICellPop();
                onClose();
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] font-bold text-neutral-300 border border-neutral-700 cursor-pointer"
            >
              <X className="w-3 h-3" />
              {t.close}
            </button>
          </div>
        </div>

        {/* Night 3 Car Emergency Progress Banner */}
        {isEmergencyActive && (
          <div
            className={`px-3.5 py-2 border-b text-[11px] font-bold ${
              emergency.calledPolice && emergency.textedJohn
                ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
                : 'bg-red-950/90 border-red-800 text-red-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="leading-snug">
                {emergency.calledPolice && emergency.textedJohn
                  ? t.emergencyDone
                  : t.emergencyBanner}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-[10px]">
              <span
                className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                  emergency.calledPolice
                    ? 'bg-emerald-900/70 border-emerald-500 text-emerald-200'
                    : 'bg-black/40 border-red-700 text-red-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {t.callsTab.calledPoliceBadge}
              </span>
              <span
                className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                  emergency.textedJohn
                    ? 'bg-emerald-900/70 border-emerald-500 text-emerald-200'
                    : 'bg-black/40 border-red-700 text-red-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {t.messagesTab.sentToJohnBadge}
              </span>
            </div>
          </div>
        )}

        {/* Screen Body */}
        <div className="h-[360px] bg-gradient-to-b from-slate-950 via-neutral-950 to-black p-4 overflow-y-auto flex flex-col">
          {/* HOME SCREEN */}
          {tab === 'home' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="text-center py-4 border border-neutral-800/80 rounded-2xl bg-neutral-900/50">
                <div className="text-[10px] uppercase tracking-widest text-neutral-400">
                  NIGHT {nightState.night}
                </div>
                <div className="text-3xl font-black text-amber-400 tabular-nums tracking-wider mt-1">
                  {timeString}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 my-auto pt-4">
                <button
                  onClick={() => {
                    soundEngine.playUICellPop();
                    setTab('calls');
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/70 text-emerald-200 cursor-pointer transition-all active:scale-95"
                >
                  <Phone className="w-7 h-7 text-emerald-400" />
                  <span className="text-[11px] font-bold">{t.apps.calls}</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playUICellPop();
                    setTab('messages');
                  }}
                  className="relative flex flex-col items-center gap-2 p-3 rounded-2xl bg-sky-950/70 hover:bg-sky-900/80 border border-sky-700/70 text-sky-200 cursor-pointer transition-all active:scale-95"
                >
                  {isEmergencyActive && !emergency.textedJohn && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
                  )}
                  <MessageSquare className="w-7 h-7 text-sky-400" />
                  <span className="text-[11px] font-bold">{t.apps.messages}</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playUICellPop();
                    setTab('camera');
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/70 text-amber-200 cursor-pointer transition-all active:scale-95"
                >
                  <Camera className="w-7 h-7 text-amber-400" />
                  <span className="text-[11px] font-bold">{t.apps.camera}</span>
                </button>
              </div>
            </div>
          )}

          {/* CALLS APP (Mom, Landlord, Police 911) */}
          {tab === 'calls' && (
            <div className="space-y-2.5">
              {activeCall && callState !== 'idle' && (
                <div className="p-3 rounded-xl bg-neutral-900 border border-emerald-600/70 mb-2">
                  <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                    {callState === 'dialing'
                      ? t.callsTab.callingStatus(getCallTargetName(activeCall))
                      : t.callsTab.connectedStatus(getCallTargetName(activeCall))}
                  </div>
                  {callState === 'connected' && (
                    <p className="mt-1.5 text-xs text-neutral-100 leading-relaxed">
                      &ldquo;{getCallTranscript(activeCall)}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {(['mom', 'landlord'] as const).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-neutral-900/90 border border-neutral-800"
                >
                  <span className="text-xs font-bold text-neutral-100 truncate">
                    {t.contacts[key]}
                  </span>
                  <button
                    onClick={() => startCall(key)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer shrink-0 active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    {t.callsTab.callBtn}
                  </button>
                </div>
              ))}

              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-red-950/60 border border-red-700/80">
                <span className="text-xs font-black text-red-200 truncate">
                  {t.contacts.police}
                </span>
                <button
                  onClick={() => startCall('police')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-black cursor-pointer shrink-0 active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  {t.callsTab.callBtn}
                </button>
              </div>
            </div>
          )}

          {/* MESSAGES APP (Mom, Landlord, John) */}
          {tab === 'messages' && !activeThread && (
            <div className="space-y-2.5">
              {(['mom', 'landlord', 'john'] as ContactKey[]).map((key) => {
                const preview =
                  key === 'mom'
                    ? t.messagesTab.momThread[t.messagesTab.momThread.length - 1]?.text
                    : key === 'landlord'
                    ? t.messagesTab.landlordThread[t.messagesTab.landlordThread.length - 1]?.text
                    : t.messagesTab.johnThread[t.messagesTab.johnThread.length - 1]?.text;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      soundEngine.playUICellPop();
                      setActiveThread(key);
                    }}
                    className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all hover:bg-neutral-800/80 ${
                      key === 'john' && isEmergencyActive && !emergency.textedJohn
                        ? 'bg-red-950/50 border-red-600'
                        : 'bg-neutral-900/90 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-300">{t.contacts[key]}</span>
                      {key === 'john' && isEmergencyActive && !emergency.textedJohn && (
                        <span className="text-[10px] font-black text-red-400">SOS</span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-1">{preview}</p>
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'messages' && activeThread && (
            <div className="flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <div className="text-[11px] font-black text-amber-400 uppercase pb-1 border-b border-neutral-800">
                  {t.contacts[activeThread]}
                </div>
                {(activeThread === 'mom'
                  ? t.messagesTab.momThread
                  : activeThread === 'landlord'
                  ? t.messagesTab.landlordThread
                  : t.messagesTab.johnThread
                ).map((msg, idx) => {
                  const isDuck = msg.from === 'Duck';
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-[11px] leading-snug ${
                        isDuck
                          ? 'bg-sky-900/70 text-sky-100 ml-6 border border-sky-700/60'
                          : 'bg-neutral-900 text-neutral-200 mr-6 border border-neutral-800'
                      }`}
                    >
                      <div className="flex justify-between text-[9px] text-neutral-400 mb-0.5 font-bold">
                        <span>{msg.from}</span>
                        <span>{msg.time}</span>
                      </div>
                      {msg.text}
                    </div>
                  );
                })}

                {activeThread === 'john' && emergency.textedJohn && (
                  <>
                    <div className="p-2.5 rounded-xl text-[11px] leading-snug bg-sky-900/80 text-sky-100 ml-5 border border-sky-600">
                      <div className="text-[9px] text-sky-300 mb-0.5 font-bold">Duck</div>
                      {t.messagesTab.johnHelpOutgoing}
                    </div>
                    {johnReplied && (
                      <div className="p-2.5 rounded-xl text-[11px] leading-snug bg-emerald-950/80 text-emerald-100 mr-5 border border-emerald-700">
                        <div className="text-[9px] text-emerald-300 mb-0.5 font-bold">John</div>
                        {t.messagesTab.johnHelpReply}
                      </div>
                    )}
                  </>
                )}
              </div>

              {activeThread === 'john' && isEmergencyActive && !emergency.textedJohn && (
                <button
                  onClick={handleSendEmergencyText}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center justify-center gap-2 border border-red-400 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>{t.messagesTab.sendEmergencyJohn}</span>
                </button>
              )}
            </div>
          )}

          {/* CAMERA APP */}
          {tab === 'camera' && (
            <div className="flex-1 flex flex-col justify-between gap-3">
              <button
                onClick={onCapturePhoto}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black text-xs font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Camera className="w-4 h-4" />
                {photos.length > 0 ? t.cameraTab.retake : t.cameraTab.takePhoto}
              </button>

              {photos.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center text-[11px] text-neutral-400 px-3 border border-dashed border-neutral-800 rounded-xl">
                  {t.cameraTab.emptyGallery}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase">
                    {t.cameraTab.savedCount(photos.length)}
                  </div>
                  <img
                    src={photos[0]}
                    alt="Snapshot"
                    className="w-full h-36 object-cover rounded-xl border border-neutral-700"
                  />
                  {photos.length > 1 && (
                    <div className="grid grid-cols-3 gap-1.5">
                      {photos.slice(1, 7).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Saved ${i + 2}`}
                          className="w-full h-12 object-cover rounded border border-neutral-800"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Home Bar */}
        <div className="bg-neutral-950 py-2 flex justify-center border-t border-neutral-900">
          <button
            onClick={() => {
              soundEngine.playUICellPop();
              setTab('home');
              setActiveThread(null);
            }}
            className="w-24 h-1.5 rounded-full bg-neutral-700 hover:bg-neutral-500 cursor-pointer"
            aria-label="Home"
          />
        </div>
      </div>
    </div>
  );
};
