import { useState } from 'react';
import { CreditCard, Check, Sparkles, Download, Receipt, Users } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
  invoiceNo: string;
}

const INVOICES: Invoice[] = [
  { id: '1', date: 'Jun 01, 2026', amount: '$1,240.00', status: 'paid', invoiceNo: 'INV-2026-003' },
  { id: '2', date: 'May 01, 2026', amount: '$940.00', status: 'paid', invoiceNo: 'INV-2026-002' },
  { id: '3', date: 'Apr 01, 2026', amount: '$720.00', status: 'paid', invoiceNo: 'INV-2026-001' },
];

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState<'hobby' | 'pro' | 'enterprise'>('pro');
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Quota Data
  const usedRequests = 720000;
  const totalRequests = currentPlan === 'hobby' ? 100000 : currentPlan === 'pro' ? 1000000 : 10000000;
  const usagePercentage = Math.round((usedRequests / totalRequests) * 100);

  const handleUpgrade = (tier: 'hobby' | 'pro' | 'enterprise') => {
    if (tier === currentPlan) return;
    setIsUpgrading(true);
    setTimeout(() => {
      setCurrentPlan(tier);
      setIsUpgrading(false);
      alert(`Successfully upgraded to the ${tier.toUpperCase()} plan!`);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <CreditCard className="text-indigo-400" size={32} /> Billing & Subscriptions
        </h1>
        <p className="text-slate-400 mt-2">
          Manage your subscription plans, monitor your quota limits, and download invoices.
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quota breakdown */}
        <div className="lg:col-span-2 p-6 glass-panel rounded-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-72 h-72 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
          
          {/* Circular Progress Gauge */}
          <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                strokeWidth="10"
                stroke="rgba(255,255,255,0.05)"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                strokeWidth="10"
                stroke="url(#indigoGrad)"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * usagePercentage) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{usagePercentage}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Used</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                Active Tier: {currentPlan.toUpperCase()}
              </span>
              <h2 className="text-xl font-bold text-white mt-2">API Quota Usage</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Volume Used</p>
                <p className="text-xl font-bold text-white mt-1">{(usedRequests / 1000).toLocaleString()}k <span className="text-xs font-normal text-slate-400">requests</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Allocation</p>
                <p className="text-xl font-bold text-white mt-1">
                  {totalRequests >= 1000000 ? `${totalRequests / 1000000}M` : `${totalRequests / 1000}k`} <span className="text-xs font-normal text-slate-400">requests</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Card mockup */}
        <div className="p-6 bg-gradient-to-tr from-indigo-950 via-slate-900 to-slate-900 border border-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col justify-between h-56 shadow-2xl group">
          {/* Card subtle glowing details */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Default Payment Method</p>
              <h3 className="text-lg font-bold text-white mt-0.5">Corporate Visa</h3>
            </div>
            <div className="w-10 h-6 bg-slate-800/80 rounded-md flex items-center justify-center text-[10px] font-black text-slate-300">VISA</div>
          </div>
          
          <div className="font-mono text-xl tracking-widest text-slate-100 py-4 z-10">
            ••••  ••••  ••••  8824
          </div>
          
          <div className="flex justify-between items-end z-10">
            <div>
              <p className="text-[8px] text-slate-400 uppercase tracking-widest">Card Holder</p>
              <p className="text-xs font-semibold text-slate-200">Alex Rivers</p>
            </div>
            <div>
              <p className="text-[8px] text-slate-400 uppercase tracking-widest">Expires</p>
              <p className="text-xs font-semibold text-slate-200">08 / 29</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Choice */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-indigo-400" size={20} /> Subscription Plans
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Hobby */}
          <div className={`p-6 glass-panel rounded-3xl relative overflow-hidden border flex flex-col justify-between gap-6 transition ${
            currentPlan === 'hobby' ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/5 bg-slate-900/50' : 'border-slate-800/60 hover:border-slate-700'
          }`}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white">Hobby</h3>
                {currentPlan === 'hobby' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400">Current</span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-2">For individuals and small personal tools.</p>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">$0</span>
                <span className="text-slate-400 text-sm"> / month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> 100,000 requests / month
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> 1 active API Key
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> Community support
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgrade('hobby')}
              disabled={currentPlan === 'hobby' || isUpgrading}
              className={`w-full py-2.5 rounded-xl font-bold transition text-sm cursor-pointer ${
                currentPlan === 'hobby'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-850'
              }`}
            >
              {currentPlan === 'hobby' ? 'Active Plan' : 'Downgrade to Hobby'}
            </button>
          </div>

          {/* Plan Pro */}
          <div className={`p-6 glass-panel-glow rounded-3xl relative overflow-hidden border flex flex-col justify-between gap-6 transition ${
            currentPlan === 'pro' ? 'border-indigo-500/80 shadow-lg shadow-indigo-500/10 bg-slate-900/60' : 'border-slate-800/60 hover:border-indigo-500/30'
          }`}>
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-indigo-600/10 rounded-full filter blur-xl"></div>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  Professional <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                </h3>
                {currentPlan === 'pro' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400">Current</span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-2">For production applications and growing teams.</p>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">$49</span>
                <span className="text-slate-400 text-sm"> / month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> 1,000,000 requests / month
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> Unlimited API Keys
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> Advanced rate limiting policies
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> Email & Discord support
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={currentPlan === 'pro' || isUpgrading}
              className={`w-full py-2.5 rounded-xl font-bold transition text-sm cursor-pointer ${
                currentPlan === 'pro'
                  ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:scale-[1.02]'
              }`}
            >
              {currentPlan === 'pro' ? 'Active Plan' : 'Upgrade to Professional'}
            </button>
          </div>

          {/* Plan Enterprise */}
          <div className={`p-6 glass-panel rounded-3xl relative overflow-hidden border flex flex-col justify-between gap-6 transition ${
            currentPlan === 'enterprise' ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/5 bg-slate-900/50' : 'border-slate-800/60 hover:border-slate-700'
          }`}>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  Enterprise <Users size={16} className="text-slate-400" />
                </h3>
                {currentPlan === 'enterprise' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400">Current</span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-2">For custom scale, high concurrency, and compliance.</p>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">Custom</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> Custom volume allocations
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> Dedicated gateway shards
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> 99.99% SLA Guarantee
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-indigo-400" /> 24/7 Phone support & Slack channel
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgrade('enterprise')}
              disabled={currentPlan === 'enterprise' || isUpgrading}
              className={`w-full py-2.5 rounded-xl font-bold transition text-sm cursor-pointer ${
                currentPlan === 'enterprise'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-850'
              }`}
            >
              {currentPlan === 'enterprise' ? 'Active Plan' : 'Contact Sales'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Receipt className="text-indigo-400" size={20} /> Billing History
        </h2>
        
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice Number</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {INVOICES.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-white">{invoice.invoiceNo}</td>
                    <td className="px-6 py-4 text-slate-300">{invoice.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => alert(`Downloading ${invoice.invoiceNo}...`)}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition font-medium cursor-pointer"
                      >
                        <Download size={12} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
