import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Zap, AlertTriangle, Database, Activity } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend 
} from 'recharts';

// Data for different timeframes
const DATA_SETS = {
  '24h': {
    usage: [
      { name: '00:00', requests: 450 }, { name: '04:00', requests: 300 },
      { name: '08:00', requests: 800 }, { name: '12:00', requests: 1200 },
      { name: '16:00', requests: 950 }, { name: '20:00', requests: 1100 }
    ],
    latency: [
      { name: '00:00', avg: 125, p99: 180 }, { name: '04:00', avg: 110, p99: 165 },
      { name: '08:00', avg: 145, p99: 240 }, { name: '12:00', avg: 160, p99: 290 },
      { name: '16:00', avg: 135, p99: 210 }, { name: '20:00', avg: 140, p99: 220 }
    ],
    statuses: [
      { name: '2xx OK', value: 9200, color: '#10b981' },
      { name: '3xx Redirect', value: 450, color: '#6366f1' },
      { name: '4xx Client Error', value: 250, color: '#f59e0b' },
      { name: '5xx Server Error', value: 100, color: '#ef4444' }
    ],
    endpoints: [
      { name: '/v1/users', calls: 3200 },
      { name: '/v1/billing/charges', calls: 2400 },
      { name: '/v1/auth/tokens', calls: 1800 },
      { name: '/v1/webhooks', calls: 1100 },
      { name: '/v1/usage', calls: 900 }
    ],
    kpis: {
      avgLatency: '135ms',
      errorRate: '1.0%',
      dataTransferred: '142 MB',
      peakReq: '140/s'
    }
  },
  '7d': {
    usage: [
      { name: 'Mon', requests: 12000 }, { name: 'Tue', requests: 14500 },
      { name: 'Wed', requests: 19000 }, { name: 'Thu', requests: 17200 },
      { name: 'Fri', requests: 15500 }, { name: 'Sat', requests: 9800 },
      { name: 'Sun', requests: 11200 }
    ],
    latency: [
      { name: 'Mon', avg: 138, p99: 220 }, { name: 'Tue', avg: 142, p99: 235 },
      { name: 'Wed', avg: 155, p99: 270 }, { name: 'Thu', avg: 148, p99: 250 },
      { name: 'Fri', avg: 140, p99: 215 }, { name: 'Sat', avg: 122, p99: 180 },
      { name: 'Sun', avg: 128, p99: 195 }
    ],
    statuses: [
      { name: '2xx OK', value: 91400, color: '#10b981' },
      { name: '3xx Redirect', value: 3800, color: '#6366f1' },
      { name: '4xx Client Error', value: 2900, color: '#f59e0b' },
      { name: '5xx Server Error', value: 900, color: '#ef4444' }
    ],
    endpoints: [
      { name: '/v1/users', calls: 34500 },
      { name: '/v1/billing/charges', calls: 27800 },
      { name: '/v1/auth/tokens', calls: 19200 },
      { name: '/v1/webhooks', calls: 11500 },
      { name: '/v1/usage', calls: 6200 }
    ],
    kpis: {
      avgLatency: '140ms',
      errorRate: '0.9%',
      dataTransferred: '1.43 GB',
      peakReq: '210/s'
    }
  },
  '30d': {
    usage: [
      { name: 'W1', requests: 78000 }, { name: 'W2', requests: 84000 },
      { name: 'W3', requests: 99000 }, { name: 'W4', requests: 115000 }
    ],
    latency: [
      { name: 'W1', avg: 142, p99: 245 }, { name: 'W2', avg: 139, p99: 228 },
      { name: 'W3', avg: 148, p99: 260 }, { name: 'W4', avg: 154, p99: 285 }
    ],
    statuses: [
      { name: '2xx OK', value: 348000, color: '#10b981' },
      { name: '3xx Redirect', value: 16500, color: '#6366f1' },
      { name: '4xx Client Error', value: 9400, color: '#f59e0b' },
      { name: '5xx Server Error', value: 2100, color: '#ef4444' }
    ],
    endpoints: [
      { name: '/v1/users', calls: 135000 },
      { name: '/v1/billing/charges', calls: 110000 },
      { name: '/v1/auth/tokens', calls: 78000 },
      { name: '/v1/webhooks', calls: 35000 },
      { name: '/v1/usage', calls: 18000 }
    ],
    kpis: {
      avgLatency: '146ms',
      errorRate: '0.5%',
      dataTransferred: '5.62 GB',
      peakReq: '320/s'
    }
  }
};

export default function Analytics() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  
  const currentData = DATA_SETS[timeframe];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header with selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="text-indigo-400" size={32} /> Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Detailed inspection of gateway request volume, latency distribution, and error breakdowns.
          </p>
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl self-start md:self-auto">
          <Calendar size={16} className="text-slate-400 ml-2" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="bg-transparent text-sm font-semibold text-slate-200 focus:outline-none pr-3 py-1 cursor-pointer"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 glass-panel rounded-2xl flex items-center gap-4 border border-slate-800/80">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Zap size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Latency</p>
            <p className="text-2xl font-black text-white mt-1">{currentData.kpis.avgLatency}</p>
          </div>
        </div>

        <div className="p-5 glass-panel rounded-2xl flex items-center gap-4 border border-slate-800/80">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Error Rate</p>
            <p className="text-2xl font-black text-white mt-1">{currentData.kpis.errorRate}</p>
          </div>
        </div>

        <div className="p-5 glass-panel rounded-2xl flex items-center gap-4 border border-slate-800/80">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <Database size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bandwidth</p>
            <p className="text-2xl font-black text-white mt-1">{currentData.kpis.dataTransferred}</p>
          </div>
        </div>

        <div className="p-5 glass-panel rounded-2xl flex items-center gap-4 border border-slate-800/80">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Peak Traffic</p>
            <p className="text-2xl font-black text-white mt-1">{currentData.kpis.peakReq}</p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage volume AreaChart */}
        <div className="p-6 glass-panel rounded-2xl border border-slate-800 h-96 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" /> Gateway Request Volume
            </h3>
          </div>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.usage}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#areaColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency BarChart (Average vs p99) */}
        <div className="p-6 glass-panel rounded-2xl border border-slate-800 h-96 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={18} className="text-amber-400" /> Latency Metrics (ms)
          </h3>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.latency}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="avg" name="Average Latency" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="p99" name="99th Percentile" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Codes PieChart */}
        <div className="p-6 glass-panel rounded-2xl border border-slate-800 h-96 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-4">Request Status Distribution</h3>
          <div className="flex-grow w-full flex flex-col sm:flex-row items-center justify-around">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.statuses}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentData.statuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} calls`, 'Count']} contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total</span>
                <span className="text-xl font-black text-white">
                  {currentData.statuses.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Custom Legends list */}
            <div className="space-y-2.5 mt-4 sm:mt-0 w-full sm:w-auto">
              {currentData.statuses.map((status, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }}></span>
                  <span className="text-xs font-semibold text-slate-300 w-28">{status.name}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {Math.round((status.value / currentData.statuses.reduce((a,c)=>a+c.value, 0)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top active endpoints Horizontal BarChart */}
        <div className="p-6 glass-panel rounded-2xl border border-slate-800 h-96 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-4">Traffic by Endpoint</h3>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentData.endpoints}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Bar dataKey="calls" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
