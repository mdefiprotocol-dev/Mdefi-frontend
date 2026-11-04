import React from 'react';

interface AppUpdateModalProps {
  isOpen: boolean;
  latestVersion: string;
  releaseNotes?: string;
  downloadUrl: string;
  onClose: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  latestVersion,
  releaseNotes,
  downloadUrl,
  onClose
}) => {
  if (!isOpen) return null;

  const handleUpdate = () => {
    if (typeof window === 'undefined' || !downloadUrl) return;

    try {
      // 1. Agar Capacitor Browser plugin available hai toh direct native browser khole
      const capacitor = (window as any).Capacitor;
      if (capacitor?.Plugins?.Browser?.open) {
        capacitor.Plugins.Browser.open({ url: downloadUrl });
        return;
      }

      // 2. Guaranteed Mobile Android Fallback: Clean Dynamic Anchor Trigger
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // 3. Ultra Fallback
      window.location.href = downloadUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col p-6 rounded-3xl bg-[#09150f] border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.3)] max-w-sm w-full text-center space-y-4">
        
        {/* Glow Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl shadow-inner">
          🚀
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white tracking-wide">
            New Update Available!
          </h3>
          <p className="text-xs text-emerald-400 font-mono">
            Version v{latestVersion} is now live
          </p>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-zinc-800 text-left">
          {releaseNotes || 'Important stability improvements, faster RPC switching, and on-chain claim fixes.'}
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Later
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            Update Now ➔
          </button>
        </div>
      </div>
    </div>
  );
};