import { motion } from 'motion/react';
import { Search, Plus, Minus, Navigation, Layers2, Radio, CheckCircle, AlertTriangle, Clock, Heart, Truck, Package } from 'lucide-react';

const stats = [
  { label: 'Open Needs', value: '12', trend: '+2 since 1h', icon: AlertTriangle, color: 'text-secondary' },
  { label: 'Volunteers Active', value: '8', trend: 'On-field', icon: Heart, color: 'text-primary' },
  { label: 'Resolved Today', value: '5', trend: 'Goal: 10', icon: CheckCircle, color: 'text-emerald-600' },
  { label: 'Avg Response Time', value: '18m', trend: '-4m avg', icon: Clock, color: 'text-secondary' },
];

export default function ResponseOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Response Overview</h2>
        <p className="text-on-surface-variant mt-1">Real-time humanitarian logistics for Hyderabad Division</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Map View */}
        <section className="col-span-12 lg:col-span-8">
          <div className="bg-surface-lowest rounded-xl overflow-hidden shadow-sm relative group h-[600px]">
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="glass-panel rounded-xl p-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold whitespace-nowrap">All Needs</button>
                {['Medical', 'Food', 'Logistics', 'Counseling', 'Shelter'].map(cat => (
                  <button key={cat} className="px-4 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant text-xs font-semibold whitespace-nowrap transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute top-16 left-4 z-10 w-48">
              <div className="bg-white rounded-lg shadow-md flex items-center px-2 py-1.5">
                <Search className="text-on-surface-variant w-3 h-3" />
                <input className="border-none focus:ring-0 text-[10px] w-full p-0 ml-1 bg-transparent" placeholder="Search map..." />
              </div>
            </div>

            <div className="h-full w-full relative bg-surface-container">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1600"
                alt="Map"
                className="w-full h-full object-cover opacity-40 mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
              
              {/* Abstract Map Pins */}
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full ring-4 ring-red-500/20" />
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary/20" />
              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-yellow-400 rounded-full ring-4 ring-yellow-400/20" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute top-1/3 right-1/2 w-4 h-4 bg-red-500 rounded-full ring-4 ring-red-500/20" />

              <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <div className="flex flex-col bg-white rounded-md shadow-md overflow-hidden">
                  <button className="p-2 hover:bg-surface-low border-b border-surface-low"><Plus className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-surface-low"><Minus className="w-4 h-4" /></button>
                </div>
                <button className="p-2 bg-white rounded-md shadow-md hover:bg-surface-low"><Navigation className="w-4 h-4" /></button>
                <button className="p-2 bg-white rounded-md shadow-md hover:bg-surface-low"><Layers2 className="w-4 h-4" /></button>
              </div>

              <div className="absolute left-4 p-3 glass-panel rounded-xl space-y-2 bottom-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> CRITICAL
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> MODERATE
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span> LOW
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Updates / Pending Actions */}
        <section className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="bg-surface-lowest rounded-xl p-6 shadow-sm flex-1 border-l-4 border-secondary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-primary flex items-center gap-2">
                <Radio className="text-secondary w-5 h-5" />
                {localStorage.getItem('userRole') === 'volunteer' ? 'Nearby Requests' : 'Live Updates'}
              </h3>
              <span className="px-2 py-1 rounded bg-secondary/10 text-[10px] font-bold text-secondary">REAL-TIME</span>
            </div>
            
            <div className="space-y-6">
              {localStorage.getItem('userRole') === 'volunteer' ? (
                // Volunteer Specific View: Accept/Decline
                [
                  { id: 1, title: 'Medical Kit Delivery', zone: 'Kukatpally', time: '2m ago', priority: 'Critical' },
                  { id: 2, title: 'Food Rations (4pk)', zone: 'Miyapur', time: '5m ago', priority: 'High' },
                  { id: 3, title: 'Water Supply (20L)', zone: 'Jubilee Hills', time: '12m ago', priority: 'Moderate' },
                ].map((req) => (
                  <div key={req.id} className="p-4 bg-surface-low rounded-xl border border-outline-variant/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-primary">{req.title}</h4>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        req.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-secondary/10 text-secondary'
                      }`}>{req.priority}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">Zone: {req.zone} • {req.time}</p>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all">
                        ACCEPT
                      </button>
                      <button className="flex-1 py-2 border border-outline-variant text-on-surface-variant text-[10px] font-bold rounded-lg hover:bg-surface-container active:scale-95 transition-all">
                        DECLINE
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Default View: Live Updates
                [
                  { title: 'New critical need in Kukatpally', desc: 'Food + Medical supplies requested for 4 families.', time: '2 mins ago', critical: true },
                  { title: 'Ravi accepted assignment in Miyapur', desc: 'Delivery of logistics kit expected in 45 mins.', time: '12 mins ago', success: true },
                  { title: 'Need unassigned for 35 mins', desc: 'Secunderabad shelter request pending coordinator action.', time: '35 mins ago', warning: true },
                  { title: 'Batch Resolved: Jubilee Hills', desc: 'All 4 logistics requests completed successfully.', time: '1 hour ago', success: true, opacity: 'opacity-70' },
                ].map((update, i) => (
                  <div key={i} className={`flex gap-4 ${update.opacity || ''}`}>
                    <div className="mt-1 flex-shrink-0">
                      {update.critical ? <div className="w-3 h-3 rounded-full bg-red-500 pulse-dot" /> :
                       update.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                       <AlertTriangle className="w-4 h-4 text-secondary" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{update.title}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{update.desc}</p>
                      <p className="text-[10px] text-on-surface-variant mt-2 font-medium">{update.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button className="w-full mt-8 py-3 rounded-lg border border-outline-variant/30 text-xs font-bold text-primary hover:bg-surface-low transition-colors">
              View Audit Log
            </button>
          </div>
        </section>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4 }}
            className="bg-[#FFF8F0] p-6 rounded-xl shadow-sm group transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`p-2 bg-white rounded-lg ${stat.color} shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </span>
              <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
            </div>
            <h4 className="text-4xl font-headline font-extrabold text-primary">{stat.value}</h4>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
