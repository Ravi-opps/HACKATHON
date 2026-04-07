import { useLocation } from 'react-router-dom';
import { Search, Bell, HelpCircle, Settings } from 'lucide-react';

export default function Topbar() {
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 px-8 z-40 bg-surface/80 backdrop-blur-xl flex justify-between items-center">
      <div className="flex items-center gap-4 w-1/2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            placeholder="Search mission, zone or skill..."
            className="w-full bg-surface-container border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-container transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-secondary transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="text-on-surface-variant hover:text-secondary transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-[10px] text-white flex items-center justify-center rounded-full font-bold">3</span>
        </button>
        <button className="text-on-surface-variant hover:text-secondary transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
          <div className="text-right">
            <p className="text-sm font-bold text-primary leading-tight">Ravi Kumar</p>
            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Volunteer Specialist</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-primary/10"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
