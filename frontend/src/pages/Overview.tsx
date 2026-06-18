import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, TrendingUp, AlertCircle, Cpu, ShieldCheck, Database, Calendar } from 'lucide-react';
import KPICard from '../components/KPICard';

const data = [
  { name: 'Mon', calls: 1200 },
  { name: 'Tue', calls: 1900 },
  { name: 'Wed', calls: 3000 },
  { name: 'Thu', calls: 2500 },
  { name: 'Fri', calls: 3400 },
  { name: 'Sat', calls: 2800 },
  { name: 'Sun', calls: 3100 },
];

const LOGS = [
  { path: '/v1/users/usr_28a9d1', method: 'GET', status: 200, latency: '12ms', time: 'Just now' },
  { path: '/v1/billing/charges', method: 'POST', status: 200, latency: '48ms', time: '2s ago' },
  { path: '/v1/auth/tokens', method: 'POST', status: 201, latency: '32ms', time: '14s ago' },
  { path: '/v1/analytics/usage', method: 'GET', status: 429, latency: '4ms', time: '28s ago' },
  { path: '/v1/users/usr_28a9d1', method: 'DELETE', status: 204, latency: '19ms', time: '1m ago' },
  { path: '/v1/webhooks/stripe', method: 'POST', status: 500, latency: '124ms', time: '3m ago' },
];

export default function Overview() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Welcome back, Alex <span className="animate-wave inline-block">👋</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md">
            Your API gateway is running optimally. We observed a <span className="text-emerald-400 font-bold">+12.4%</span> traffic uptick this week.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold">
          <ShieldCheck size={16} /> All Services Operational
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard 
          title="Total API Calls" 
          value="8.6M" 
          change="+14.2%" 
          trend="up" 
          icon={<Cpu className="text-indigo-400" size={20} />} 
        />
        <KPICard 
          title="Current Month Bill" 
          value="$1,240" 
          change="+$320" 
          trend="up" 
          icon={<Database className="text-purple-400" size={20} />} 
        />
        <KPICard 
          title="Active API Keys" 
          value="24" 
          change="0" 
          trend="neutral" 
          icon={<Cpu className="text-pink-400" size={20} />} 
        />
        <KPICard 
          title="Usage Quota" 
          value="72%" 
          change="Limit Warning" 
          trend="down" 
          icon={<AlertCircle className="text-amber-400" size={20} />} 
        />
      </div>

      {/* Chart container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Usage graph */}
        <div className="lg:col-span-8 p-6 glass-panel rounded-2xl border border-slate-800 h-96 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" /> Gateway Request Volume
            </h3>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-900 text-xs font-bold text-slate-400">
              <Calendar size={12} /> Last 7 Days
            </div>
          </div>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#glowArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Access logs list preview */}
        <div className="lg:col-span-4 p-6 glass-panel rounded-2xl border border-slate-800 flex flex-col h-96 justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Play size={16} className="text-emerald-400 animate-pulse" /> Live Request Stream
            </h3>
            <p className="text-xs text-slate-400">Access logs passing through gateway routing</p>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar space-y-3 mt-4">
            {LOGS.map((log, index) => (
              <div key={index} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-900/60 hover:bg-slate-900/80 transition duration-200">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                      log.method === 'POST' ? 'bg-indigo-500/15 text-indigo-400' :
                      log.method === 'DELETE' ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {log.method}
                    </span>
                    <p className="text-xs font-mono font-medium text-slate-200 truncate">{log.path}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{log.time} • {log.latency}</p>
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 200 || log.status === 201 || log.status === 204
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : log.status === 429
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-rose-500/15 text-rose-400'
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
  );
}