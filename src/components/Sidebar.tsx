import { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, FileText, Settings, Bell, HelpCircle, LogOut, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { icon: Map, label: 'Live Map', path: '/map', roles: ['volunteer', 'coordinator'] },
  { icon: FileText, label: 'Voice Notes', path: '/reports', roles: ['field'] },
  { icon: LayoutDashboard, label: 'Reports', path: '/admin', roles: ['admin'] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || '';

  if (location.pathname === '/' || location.pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-low flex flex-col py-8 px-4 z-50">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Leaf className="text-white w-6 h-6 fill-current" />
          </motion.div>
        </div>
        <div>
          <h1 className="text-xl font-headline font-black tracking-tighter text-primary uppercase">GROUNDPULSE</h1>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Crisis Response</p>
        </div>
      </div>

      <nav className="flex-grow space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold bg-surface-container border-r-4 border-primary'
                  : 'text-on-surface-variant font-medium hover:bg-surface-container hover:text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-headline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-4 rounded-xl bg-primary text-white">
          <button className="w-full font-headline font-bold text-sm py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-container transition-transform active:scale-95 shadow-lg">
            Deploy Resources
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant font-medium hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-headline">Logout</span>
        </button>
      </div>
    </aside>
  );
}
