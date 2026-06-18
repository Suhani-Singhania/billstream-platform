import { useState } from 'react';
import { Sparkles, Terminal, Activity, ArrowRight, Shield, Layers, Code } from 'lucide-react';

export default function Landing() {
  const [playCount, setPlayCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [responseLog, setResponseLog] = useState<{status: number; time: string; path: string}[]>([
    { status: 200, time: '14ms', path: '/v1/status' }
  ]);

  const triggerMockRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      const paths = ['/v1/users', '/v1/billing/charges', '/v1/auth', '/v1/analytics'];
      const randomPath = paths[Math.floor(Math.random() * paths.length)];
      const isRateLimited = playCount >= 5 && Math.random() > 0.4;
      
      const newLog = {
        status: isRateLimited ? 429 : 200,
        time: `${Math.floor(Math.random() * 45) + 5}ms`,
        path: randomPath
      };
      
      setResponseLog([newLog, ...responseLog.slice(0, 4)]);
      setPlayCount(prev => prev + 1);
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full filter blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full filter blur-[120px] animate-pulse-glow" style={{ animationDelay: '-4s' }}></div>

      {/* Top Header/Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Layers className="text-indigo-400" size={24} />
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            BillStream
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#playground" className="hover:text-white transition">Playground</a>
          <a href="#docs" className="hover:text-white transition">Docs</a>
        </div>
        <a 
          href="/dashboard" 
          className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer"
        >
          Console
        </a>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left column hero text */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
            <Sparkles size={12} className="animate-spin" /> v1.0 Now Live
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            API Billing & Rate Limiting, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
            The modern, developer-first gateway middleware. Authenticate tokens, enforce rate limits, and implement multi-tenant billing with enterprise precision.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="/dashboard" 
              className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-all duration-300 shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              Get Started Free <ArrowRight size={18} />
            </a>
            <button 
              onClick={() => document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              Interactive Demo
            </button>
          </div>
        </div>

        {/* Right column interactive playground mockup */}
        <div id="playground" className="lg:col-span-5 w-full max-w-lg mx-auto">
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
            
            {/* Window header */}
            <div className="bg-slate-900/80 px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">Live Gateway Playground</span>
              <Terminal size={14} className="text-slate-500" />
            </div>

            {/* Playground controls and terminal */}
            <div className="p-6 space-y-6">
              {/* Method and action selector */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
                  <button 
                    onClick={() => setMethod('GET')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition ${
                      method === 'GET' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    GET
                  </button>
                  <button 
                    onClick={() => setMethod('POST')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition ${
                      method === 'POST' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    POST
                  </button>
                </div>
                <button
                  onClick={triggerMockRequest}
                  disabled={isSending}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-indigo-500/10 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSending ? 'Sending Request...' : 'Send Mock Request'}
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-900">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Request Count</p>
                  <p className="text-xl font-bold text-white mt-1">{playCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Playground Rate Limit</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {playCount >= 5 ? (
                      <span className="text-amber-400">Quota Warning</span>
                    ) : (
                      '5 req limit'
                    )}
                  </p>
                </div>
              </div>

              {/* Terminal Logs log */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Code size={12} /> Live Gateway Logs
                </p>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 font-mono text-xs space-y-2 h-36 overflow-y-auto no-scrollbar">
                  {responseLog.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-900/40 last:border-0">
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-500">&gt;</span>
                        <span className="text-indigo-400 font-semibold">{method}</span>
                        <span className="text-slate-300">{log.path}</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="text-slate-500">{log.time}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Benefits grid section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white">Engineered for Developers</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Everything you need to configure robust API ecosystems in single and multi-tenant architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 glass-panel rounded-3xl hover:border-slate-700/80 transition-all duration-300 group">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Shield size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mt-6">Secure Access</h3>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Generate cryptographic keys and validate signatures securely at our global edge caches, reducing latency.
            </p>
          </div>

          <div className="p-8 glass-panel rounded-3xl hover:border-slate-700/80 transition-all duration-300 group">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Activity size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mt-6">Granular Rate Limits</h3>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Enforce limits per tier, per key, or custom headers in real-time using distributed Redis token-bucket algorithms.
            </p>
          </div>

          <div className="p-8 glass-panel rounded-3xl hover:border-slate-700/80 transition-all duration-300 group">
            <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-400 w-12 h-12 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <Layers size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mt-6">Multi-tenant Metering</h3>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Track utilization metrics down to milliseconds. Instantly sync with Stripe, Lago, or custom invoicing handlers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>© 2026 BillStream. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}