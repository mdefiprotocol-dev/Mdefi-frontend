import React, { useState, useEffect, useRef } from 'react';

interface ApkWelcomeSplashProps {
  onEnter: () => void;
}

export const ApkWelcomeSplash: React.FC<ApkWelcomeSplashProps> = ({ onEnter }) => {
  const [speechFinished, setSpeechFinished] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasSpokenRef = useRef(false);

  // डीप और सिनेमैटिक वॉइस इंजन
  const triggerCinematicIntro = () => {
    if (hasSpokenRef.current) return;
    hasSpokenRef.current = true;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = "Welcome to M De Fi Protocol and Networks.";
      const utterance = new SpeechSynthesisUtterance(text);

      // डीप सिनेमैटिक बेस सेटिंग्स
      utterance.pitch = 0.65; // प्राकृतिक और भारी आवाज़
      utterance.rate = 0.88;  // ठहराव वाली प्रीमियम स्पीड
      utterance.volume = 1.0;

      // सिस्टम की सबसे हाई-डेफिनिशन वॉइस चुनना
      const assignBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('premium'))
        ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      assignBestVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = assignBestVoice;
      }

      // आवाज़ खत्म होते ही एंटर बटन अनलॉक होगा
      utterance.onend = () => {
        setSpeechFinished(true);
      };

      utterance.onerror = () => {
        // अगर वॉइस लोड न हो पाए तो भी बटन 2.5 सेकंड में ऑटो-अनलॉक हो जाएगा
        setSpeechFinished(true);
      };

      window.speechSynthesis.speak(utterance);

      // फॉलबैक टाइमर: अधिकतम 3.2 सेकंड बाद बटन ज़रूर दिखाई देगा
      setTimeout(() => {
        setSpeechFinished(true);
      }, 3200);
    } else {
      setSpeechFinished(true);
    }
  };

  useEffect(() => {
    // स्क्रीन रेंडर होने के 400ms बाद इंट्रो शुरू
    const timer = setTimeout(() => {
      triggerCinematicIntro();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    // 600ms का स्मूथ फेड-आउट ट्रांजिशन, फिर पब्लिक फ्रंट पेज पर लैंड
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-between p-6 bg-[#030712] select-none overflow-hidden transition-all duration-700 ease-out ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 35%, rgba(13, 148, 136, 0.15) 0%, rgba(3, 7, 18, 0.98) 75%)',
      }}
    >
      {/* बैकग्राउंड में Web3 एम्बिएंट ग्लो रिंग्स */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/10 to-emerald-500/20 rounded-full blur-[90px] animate-pulse" />
      </div>

      {/* टॉप स्टेटस बार */}
      <div className="w-full flex justify-between items-center pt-3 z-10">
        <span className="text-[10px] tracking-widest text-emerald-400 font-mono uppercase bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.25)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          CORE ONLINE
        </span>
        <span className="text-[10px] tracking-widest text-teal-400 font-mono uppercase bg-teal-950/40 border border-teal-500/30 px-3 py-1 rounded-full">
          BEP-20 ECOSYSTEM
        </span>
      </div>

      {/* सेंटर: MBTC लोगो और प्रीमियम कलरफुल टाइटल्स */}
      <div className="flex flex-col items-center justify-center text-center my-auto z-10 max-w-sm px-2">
        {/* ग्लोइंग नियॉन सिंबल */}
        <div className="relative mb-8">
          <div className="absolute -inset-3 bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 rounded-full blur-xl opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl bg-[#09111e] border border-teal-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.35)]">
            <span className="text-4xl font-black bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
              M
            </span>
          </div>
        </div>

        {/* हेडलाइन */}
        <h1 className="text-3xl font-black tracking-tight mb-2">
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            MDeFi{' '}
          </span>
          <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(45,212,191,0.4)]">
            PROTOCOL
          </span>
        </h1>

        <p className="text-xs font-semibold tracking-widest text-teal-300/80 uppercase font-mono mb-4">
          Decentralized Matrix &amp; Networks
        </p>

        {/* वॉइस स्टेटस इंडिकेटर */}
        <div className="h-6 flex items-center justify-center">
          {!speechFinished ? (
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-950/40 border border-teal-800/40">
              <span className="w-1 h-3 bg-teal-400 animate-pulse rounded" />
              <span className="w-1 h-4 bg-cyan-400 animate-pulse delay-75 rounded" />
              <span className="w-1 h-2 bg-emerald-400 animate-pulse delay-150 rounded" />
              <span className="text-[11px] text-teal-300 font-mono tracking-wider ml-1">
                SYNCHRONIZING AUDIO...
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-emerald-400/90 font-mono tracking-widest">
              ● READY FOR ACCESS
            </span>
          )}
        </div>
      </div>

      {/* बॉटम: एंटर बटन (सिर्फ वॉइस पूरी होने के बाद स्मूथ प्रकट होगा) */}
      <div className="w-full z-10 pb-6 flex flex-col items-center">
        <div
          className={`w-full max-w-xs transition-all duration-700 transform ${
            speechFinished
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <button
            onClick={handleEnterClick}
            className="w-full py-4 px-6 rounded-xl font-extrabold text-slate-900 text-sm tracking-widest uppercase transition-all duration-200 active:scale-95 shadow-[0_0_30px_rgba(45,212,191,0.45)] bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400 hover:brightness-110 flex items-center justify-center gap-2"
          >
            ENTER PORTAL
            <svg
              className="w-4 h-4 text-slate-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        <span className="text-[10px] text-slate-600 font-mono mt-4 tracking-wider">
          SECURE CLIENT ENVIRONMENT • BEP-20
        </span>
      </div>
    </div>
  );
};