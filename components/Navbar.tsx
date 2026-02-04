
import React from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'entry' | 'history';
  setActiveTab: (tab: 'dashboard' | 'entry' | 'history') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'entry', label: 'Check-In', icon: 'fa-plus-circle' },
    { id: 'history', label: 'Logs', icon: 'fa-history' },
  ] as const;

  return (
    <>
      {/* Desktop Sidebar (Left Side) */}
      <nav className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <i className="fas fa-parking text-2xl"></i>
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter block leading-none">SmartPark</span>
              <span className="text-blue-600 font-bold text-sm">Rubavu Office</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Main Menu</p>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'
                }`}>
                  <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`}></i>
                </div>
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System Status</p>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Operational
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center h-16 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <i className={`fas ${tab.icon} text-lg`}></i>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
