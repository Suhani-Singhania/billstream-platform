import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export default function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  return (
    <div className="p-6 glass-panel rounded-2xl relative border border-slate-800/80 shadow-xl hover:border-slate-700/80 hover:shadow-indigo-500/[0.02] transition-all duration-300 group">
      
      {/* Top row */}
      <div className="flex justify-between items-start">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-xl group-hover:scale-105 transition-all duration-300">
            {icon}
          </div>
        )}
      </div>

      {/* Main value */}
      <p className="text-3xl font-black mt-4 text-white tracking-tight">{value}</p>

      {/* Change / Trend badge */}
      {change && (
        <div className="flex items-center gap-1.5 mt-3">
          {trend === 'up' && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight size={12} /> {change}
            </span>
          )}
          {trend === 'down' && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight size={12} /> {change}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
              {change === '0' ? 'No change' : change}
            </span>
          )}
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">vs last week</span>
        </div>
      )}
    </div>
  );
}