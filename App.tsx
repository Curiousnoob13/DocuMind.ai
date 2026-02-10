
import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Cpu, AlertCircle, Info, Github, ExternalLink } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import { PdfData, AppStatus, UserStats } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [pdfData, setPdfData] = useState<PdfData | null>(null);
  
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('documind_stats_v2');
    return saved ? JSON.parse(saved) : { uploadCount: 0 };
  });

  useEffect(() => {
    localStorage.setItem('documind_stats_v2', JSON.stringify(userStats));
  }, [userStats]);

  const handlePdfProcessed = async (data: PdfData) => {
    setPdfData(data);
    setStatus(AppStatus.PROCESSING);
    
    try {
      await geminiService.startChat(data.text);
      setUserStats(prev => ({
        uploadCount: prev.uploadCount + 1
      }));
      setStatus(AppStatus.READY);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    geminiService.resetChat();
    setPdfData(null);
    setStatus(AppStatus.IDLE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd]">
      {/* Navbar - Compact for Extension compatibility */}
      <nav className="bg-white border-b border-slate-100 py-3 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              DocuMind<span className="text-indigo-600">.ai</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-bold uppercase tracking-wider border border-green-100">
              Free Forever
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <a href="#" className="p-1.5 text-slate-400 hover:text-indigo-600">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 flex flex-col">
        {status === AppStatus.IDLE && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-10 text-center">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-100">
                <Sparkles className="w-3 h-3" />
                No-Cost AI Intelligence
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Read less, <span className="text-indigo-600">know more.</span>
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
                The private way to chat with your PDFs. 100% free with no server costs or storage.
              </p>
            </div>

            <FileUpload 
              onFileProcessed={handlePdfProcessed} 
              isProcessing={false} 
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
              {[
                { title: 'Local Privacy', desc: 'Browser-only processing.', icon: '🔒' },
                { title: 'Zero Cost', desc: 'No subscriptions needed.', icon: '💰' },
                { title: 'Instant Help', desc: 'Summaries & Q&A.', icon: '⚡' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-left">
                  <div className="text-xl mb-1">{feature.icon}</div>
                  <h4 className="font-bold text-slate-900 text-xs mb-0.5">{feature.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-slate-600">Analyzing Document...</p>
            </div>
          </div>
        )}

        {status === AppStatus.READY && pdfData && (
          <div className="flex-1 h-full min-h-[500px] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ChatInterface pdfData={pdfData} onReset={handleReset} />
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="flex-1 flex items-center justify-center">
             <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center max-w-xs">
               <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
               <h3 className="font-bold text-slate-900">Upload Failed</h3>
               <p className="text-xs text-slate-500 mt-2 mb-6">This PDF might be too large or encrypted.</p>
               <button onClick={handleReset} className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">Retry</button>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">DocuMind AI © 2024</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-indigo-600 text-[9px] font-black uppercase hover:opacity-80 transition-opacity">
              <ExternalLink className="w-2.5 h-2.5" />
              Spread the word
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
