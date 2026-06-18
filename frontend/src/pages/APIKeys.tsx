import { useState } from 'react';
import { Key, Copy, Check, Trash2, Plus, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  environment: 'production' | 'sandbox';
  value: string;
  rateLimit: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

const INITIAL_KEYS: APIKey[] = [
  {
    id: '1',
    name: 'Production Frontend Client',
    environment: 'production',
    value: 'sk_live_8f3h92kd81hfqp0s9e81',
    rateLimit: '1,000 req/min',
    created: '2026-05-12',
    lastUsed: 'Just now',
    status: 'active',
  },
  {
    id: '2',
    name: 'Staging Testing Key',
    environment: 'sandbox',
    value: 'sk_test_28djwqn128hda0qwdjhas',
    rateLimit: '100 req/min',
    created: '2026-06-01',
    lastUsed: '2 hours ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'Legacy Analytics Sync',
    environment: 'production',
    value: 'sk_live_01hd92kd81hfqp0s9e00',
    rateLimit: '5,000 req/min',
    created: '2025-11-18',
    lastUsed: '3 days ago',
    status: 'revoked',
  }
];

export default function APIKeys() {
  const [keys, setKeys] = useState<APIKey[]>(INITIAL_KEYS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [visibleKeyIds, setVisibleKeyIds] = useState<string[]>([]);
  
  // Form State
  const [keyName, setKeyName] = useState('');
  const [env, setEnv] = useState<'production' | 'sandbox'>('production');
  const [rateLimit, setRateLimit] = useState('100');
  const [createdKeyVal, setCreatedKeyVal] = useState('');

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleVisibility = (id: string) => {
    if (visibleKeyIds.includes(id)) {
      setVisibleKeyIds(visibleKeyIds.filter(x => x !== id));
    } else {
      setVisibleKeyIds([...visibleKeyIds, id]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    const randomHex = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const newKeyValue = env === 'production' 
      ? `sk_live_${randomHex}` 
      : `sk_test_${randomHex}`;

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: keyName,
      environment: env,
      value: newKeyValue,
      rateLimit: `${Number(rateLimit).toLocaleString()} req/min`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active',
    };

    setKeys([newKey, ...keys]);
    setCreatedKeyVal(newKeyValue);
    setIsCreateModalOpen(false);
    setIsRevealModalOpen(true);
    
    // Clear Form
    setKeyName('');
    setEnv('production');
    setRateLimit('100');
  };

  const handleRevoke = (id: string) => {
    if (confirm('Are you absolutely sure you want to revoke this API key? Applications using this key will immediately fail to authenticate.')) {
      setKeys(keys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Key className="text-indigo-400" size={32} /> API Keys
          </h1>
          <p className="text-slate-400 mt-2">
            Manage your credentials to authenticate client requests to the BillStream gateway.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 self-start md:self-auto cursor-pointer"
        >
          <Plus size={20} /> Create New Key
        </button>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 glass-panel rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 text-indigo-400">
            <Key size={120} />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Keys</p>
          <p className="text-4xl font-extrabold mt-3 text-white">
            {keys.filter(k => k.status === 'active').length}
          </p>
        </div>
        <div className="p-6 glass-panel rounded-2xl relative overflow-hidden">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Limit Rate Cap</p>
          <p className="text-4xl font-extrabold mt-3 text-white">6.1k <span className="text-sm font-medium text-slate-400">/min</span></p>
        </div>
        <div className="p-6 glass-panel rounded-2xl relative overflow-hidden">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gateway Status</p>
          <p className="text-4xl font-extrabold mt-3 text-emerald-400 flex items-center gap-2">
            Online
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block"></span>
          </p>
        </div>
      </div>

      {/* Keys Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Environment</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Token</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate Limit</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {keys.map((key) => {
                const isVisible = visibleKeyIds.includes(key.id);
                const maskedValue = `${key.value.slice(0, 8)}${'•'.repeat(16)}${key.value.slice(-4)}`;
                const displayValue = isVisible ? key.value : maskedValue;

                return (
                  <tr key={key.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{key.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                        key.environment === 'production' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {key.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm tracking-tight text-slate-300">
                      <div className="flex items-center gap-2">
                        <span>{displayValue}</span>
                        {key.status === 'active' && (
                          <>
                            <button 
                              onClick={() => toggleVisibility(key.id)}
                              className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                              title={isVisible ? "Hide Key" : "Reveal Key"}
                            >
                              {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button 
                              onClick={() => handleCopy(key.value, key.id)}
                              className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                              title="Copy to Clipboard"
                            >
                              {copiedKeyId === key.id ? (
                                <Check size={15} className="text-emerald-400" />
                              ) : (
                                <Copy size={15} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{key.rateLimit}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{key.created}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{key.lastUsed}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        key.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          key.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}></span>
                        {key.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {key.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                          title="Revoke Key"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative glass-panel-glow w-full max-w-md p-8 rounded-3xl overflow-hidden shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="text-indigo-400" size={24} /> Create API Key
            </h2>
            <p className="text-sm text-slate-400 mb-6">Create a credential to begin proxying requests through the platform.</p>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Key Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Application Client"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Environment</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEnv('production')}
                    className={`py-3 rounded-xl border text-sm font-semibold transition ${
                      env === 'production' 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Production
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnv('sandbox')}
                    className={`py-3 rounded-xl border text-sm font-semibold transition ${
                      env === 'sandbox' 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Sandbox
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Rate Limit Preset (req/min)
                </label>
                <select
                  value={rateLimit}
                  onChange={e => setRateLimit(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="60">60 req/min (Standard Sandbox)</option>
                  <option value="100">100 req/min (Hobby Default)</option>
                  <option value="1000">1,000 req/min (Pro Tier)</option>
                  <option value="5000">5,000 req/min (Enterprise Tier)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition cursor-pointer"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secret Key Reveal Modal */}
      {isRevealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsRevealModalOpen(false)}></div>
          <div className="relative glass-panel-glow w-full max-w-md p-8 rounded-3xl overflow-hidden shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldAlert className="text-amber-400 animate-bounce" size={24} /> Copy Your API Key
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              For security, this key is only displayed **once**. Save it immediately in a secure location.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl font-mono text-sm tracking-tight border border-slate-800 text-slate-100 break-all select-all flex items-start justify-between gap-4 mb-6">
              <span>{createdKeyVal}</span>
              <button 
                onClick={() => handleCopy(createdKeyVal, 'new_reveal')}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition cursor-pointer"
                title="Copy API Key"
              >
                {copiedKeyId === 'new_reveal' ? (
                  <Check size={18} className="text-emerald-400" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>

            <button
              onClick={() => setIsRevealModalOpen(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition text-center cursor-pointer"
            >
              I have stored it securely
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
