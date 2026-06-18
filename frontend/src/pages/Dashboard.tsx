import { useState } from 'react';
import { 
  LayoutDashboard, Key, CreditCard, BarChart3, Menu, X, 
  Bell, ChevronDown, Layers, Settings, LogOut 
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [workspace, setWorkspace] = useState<'Production' | 'Staging'>('Production');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(2);
  const location = useLocation();

  // Get active tab name for header
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard/keys') return 'API Keys';
    if (path === '/dashboard/billing') return 'Billing';
    if (path === '/dashboard/analytics') return 'Analytics';
    return 'Dashboard Overview';
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-100 overflow-hidden font-sans">
      
      {/* Background decorations */}
      <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-900 bg-slate-950/60 backdrop-blur-xl p-6 relative z-30">
        
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 select-none">
          <Layers className="text-indigo-400" size={24} />
          <span className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            BillStream
          </span>
        </div>

        {/* Workspace Switcher */}
        <div className="relative mb-6">
          <button 
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-left text-sm font-semibold transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${workspace === 'Production' ? 'bg-indigo-400' : 'bg-amber-400'}`}></span>
              <span>{workspace} Workspace</span>
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isWorkspaceOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50">
              <button
                onClick={() => { setWorkspace('Production'); setIsWorkspaceOpen(false); }}
                className="w-full text-left text-xs font-semibold p-2.5 hover:bg-slate-850 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Production Environment
              </button>
              <button
                onClick={() => { setWorkspace('Staging'); setIsWorkspaceOpen(false); }}
                className="w-full text-left text-xs font-semibold p-2.5 hover:bg-slate-850 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Staging Sandbox
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2.5 flex-grow">
          <NavItem to="/dashboard" end icon={<LayoutDashboard size={18}/>} label="Overview" />
          <NavItem to="/dashboard/keys" icon={<Key size={18}/>} label="API Keys" />
          <NavItem to="/dashboard/billing" icon={<CreditCard size={18}/>} label="Billing" />
          <NavItem to="/dashboard/analytics" icon={<BarChart3 size={18}/>} label="Analytics" />
        </nav>

        {/* Footer info */}
        <div className="border-t border-slate-900 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">Alex Rivers</p>
              <p className="text-[10px] text-slate-500 truncate">alex@billstream.dev</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Menu Container */}
          <aside className="relative flex flex-col w-64 h-full bg-slate-950 border-r border-slate-900 p-6 z-50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Layers className="text-indigo-400" size={24} />
                <span className="text-xl font-black text-white">BillStream</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2 flex-grow">
              <NavItem to="/dashboard" end icon={<LayoutDashboard size={18}/>} label="Overview" onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/dashboard/keys" icon={<Key size={18}/>} label="API Keys" onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/dashboard/billing" icon={<CreditCard size={18}/>} label="Billing" onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/dashboard/analytics" icon={<BarChart3 size={18}/>} label="Analytics" onClick={() => setIsMobileMenuOpen(false)} />
            </nav>

            <div className="border-t border-slate-900 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Alex Rivers</p>
                  <p className="text-[10px] text-slate-500">alex@billstream.dev</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-900/60 bg-slate-950/20 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-20">
          
          {/* Left info */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-300 hover:text-white p-1 hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-black text-white">{getPageTitle()}</h2>
          </div>

          {/* Right options */}
          <div className="flex items-center gap-4">
            
            {/* Notification bell */}
            <button 
              onClick={() => {
                setNotificationsCount(0);
                alert("Inbox cleared!");
              }}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900/60 rounded-xl transition cursor-pointer"
            >
              <Bell size={18} />
              {notificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">AR</div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-950 border border-slate-850 rounded-2xl p-1.5 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-slate-900">
                    <p className="text-xs font-bold text-slate-300">Alex Rivers</p>
                    <p className="text-[10px] text-slate-500">Owner</p>
                  </div>
                  <button onClick={() => alert("Settings modal here...")} className="w-full text-left text-xs font-semibold p-2 hover:bg-slate-900 rounded-lg flex items-center gap-2 cursor-pointer mt-1 text-slate-300">
                    <Settings size={14} /> Profile Settings
                  </button>
                  <a href="/" className="w-full text-left text-xs font-semibold p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg flex items-center gap-2 cursor-pointer">
                    <LogOut size={14} /> Log Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar bg-slate-950/20">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

const NavItem = ({ to, icon, label, onClick, ...props }: any) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({isActive}) => 
      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group cursor-pointer ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
      }`
    }
    {...props}
  >
    {({ isActive }) => (
      <>
        {icon}
        <span>{label}</span>
        {isActive && (
          <span className="absolute left-[-6px] top-1/4 bottom-1/4 w-1.5 rounded-r bg-indigo-400 shadow-md"></span>
        )}
      </>
    )}
  </NavLink>
);