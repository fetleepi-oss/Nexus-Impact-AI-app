import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  X,
  FileCode,
  Terminal,
  Copy,
  Check,
  Folder,
  FolderOpen,
  FileText,
  Download
} from 'lucide-react';
import { EXPO_FILES, EXPO_COMMANDS, ExpoFile } from '../data/expoFiles';

interface ExpoProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpoProjectModal: React.FC<ExpoProjectModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'commands'>('files');
  const [selectedFile, setSelectedFile] = useState<ExpoFile>(EXPO_FILES[0]);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async (text: string, type: 'file' | 'commands') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore clipboard write permission errors
    }
    if (type === 'file') {
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    } else {
      setCopiedCommands(true);
      setTimeout(() => setCopiedCommands(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    if (isZipping) return;
    setIsZipping(true);
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();

      // Package every file with its exact folder path
      EXPO_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nexus-impact-ai-expo.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to create ZIP package:', error);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-[#070D1E] border border-[#1E2F5B] rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#1E2F5B] bg-[#0A1226]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Nexus Impact AI</span>
                <span className="text-[10px] font-mono text-teal-400 font-semibold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                  Expo SDK 52 · Expo Router
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Full React Native TypeScript project source code & run instructions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Download all as ZIP button */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap ${
                downloadSuccess
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-teal-400 hover:bg-teal-300 text-[#070D1E]'
              } disabled:opacity-50`}
              title="Download all Expo project files packaged with exact folders in a single ZIP"
            >
              {isZipping ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#070D1E] border-t-transparent rounded-full animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>ZIP Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download all as ZIP</span>
                </>
              )}
            </button>

            {/* Tab Switcher */}
            <div className="flex items-center p-1 bg-[#0F1A36] rounded-lg border border-[#1E2F5B]">
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'files'
                    ? 'bg-teal-500 text-[#070D1E]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Files ({EXPO_FILES.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('commands')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'commands'
                    ? 'bg-teal-500 text-[#070D1E]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Commands</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#132145] transition-colors ml-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'files' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar File Tree */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#1E2F5B] bg-[#0A1226]/50 flex flex-col overflow-y-auto">
              <div className="p-3 border-b border-[#1E2F5B]/60 text-[11px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
                Project Files
              </div>
              <div className="p-2 space-y-1">
                {EXPO_FILES.map((file) => {
                  const isSelected = selectedFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between group ${
                        isSelected
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0F1A36]'
                      }`}
                    >
                      <span className="truncate">{file.path}</span>
                      <span className="text-[10px] text-slate-500 uppercase ml-1 shrink-0">
                        {file.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Viewer Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050914]">
              {/* Code Panel Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E2F5B] bg-[#0A1226]/80 text-xs">
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-semibold">{selectedFile.path}</span>
                </div>

                <button
                  onClick={() => handleCopyCode(selectedFile.content, 'file')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F1A36] hover:bg-[#142348] text-teal-300 border border-[#1E2F5B] transition-colors font-mono text-[11px]"
                >
                  {copiedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre Container */}
              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed selection:bg-teal-500/30">
                <pre className="whitespace-pre">{selectedFile.content}</pre>
              </div>
            </div>
          </div>
        ) : (
          /* Terminal Run Commands Panel */
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#050914]">
            <div className="p-5 rounded-2xl bg-[#0A1226] border border-[#1E2F5B] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-slate-100 font-mono">
                    Quick Start Commands (Expo SDK 52)
                  </h3>
                </div>
                <button
                  onClick={() => handleCopyCode(EXPO_COMMANDS.setup, 'commands')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#070D1E] font-bold text-xs transition-colors"
                >
                  {copiedCommands ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bash Script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#050914] border border-[#1E2F5B] font-mono text-xs text-teal-300 leading-relaxed whitespace-pre overflow-x-auto">
                {EXPO_COMMANDS.setup}
              </div>
            </div>

            {/* Platform Commands */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0A1226] border border-[#1E2F5B]">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">
                  Run on iOS (Simulator / Device)
                </h4>
                <p className="text-[11px] text-slate-400 mb-2">Requires macOS & Xcode</p>
                <code className="block p-2 rounded bg-[#050914] text-xs font-mono text-teal-300 border border-[#1E2F5B]">
                  {EXPO_COMMANDS.runIos}
                </code>
              </div>

              <div className="p-4 rounded-xl bg-[#0A1226] border border-[#1E2F5B]">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">
                  Run on Android
                </h4>
                <p className="text-[11px] text-slate-400 mb-2">Requires Android Studio</p>
                <code className="block p-2 rounded bg-[#050914] text-xs font-mono text-teal-300 border border-[#1E2F5B]">
                  {EXPO_COMMANDS.runAndroid}
                </code>
              </div>

              <div className="p-4 rounded-xl bg-[#0A1226] border border-[#1E2F5B]">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">
                  Run on Web
                </h4>
                <p className="text-[11px] text-slate-400 mb-2">Metro Web Bundler</p>
                <code className="block p-2 rounded bg-[#050914] text-xs font-mono text-teal-300 border border-[#1E2F5B]">
                  {EXPO_COMMANDS.runWeb}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
