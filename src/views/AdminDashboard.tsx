import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, MoreHorizontal, Sparkles, Activity, Heart, AlertTriangle, CheckCircle, Package, Truck } from 'lucide-react';

const kpis = [
  { label: 'Total Needs', value: '23', trend: '+12%', color: 'border-primary' },
  { label: 'Resolved', value: '19', trend: '+5%', color: 'border-emerald-700' },
  { label: 'Resolution Rate', value: '83%', trend: '+2%', color: 'border-secondary-container' },
  { label: 'Avg Dispatch', value: '18m', trend: '-4m', color: 'border-secondary', down: true },
  { label: 'Active Vols', value: '34', pulse: true, color: 'border-on-surface-variant' },
];

const activities = [
  { icon: Activity, title: 'Medical Dispatch Confirmed', desc: 'Zone Alpha - Unit 12 deployed to intersection 4B.', time: '2 min ago', tag: 'Critical', tagColor: 'bg-emerald-100 text-emerald-800' },
  { icon: Heart, title: 'New Volunteer Registered', desc: 'Sarah J. joined the Logistical Support team.', time: '14 min ago', tag: 'Pending Review', tagColor: 'bg-surface-container text-on-surface-variant' },
  { icon: AlertTriangle, title: 'Urgent Supply Request', desc: 'Eastern Buffer Zone requesting 200kg of dry rations.', time: '28 min ago', tag: 'High Priority', tagColor: 'bg-orange-100 text-orange-800' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-primary font-headline">Admin Overview</h2>
        <button className="bg-gradient-to-r from-secondary to-secondary-container text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all">
          Generate Weekly Report
        </button>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`bg-surface-lowest p-5 rounded-xl shadow-sm border-l-4 ${kpi.color}`}>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">{kpi.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-black font-headline text-primary">{kpi.value}</h3>
              {kpi.trend && (
                <span className={`text-xs font-bold flex items-center ${kpi.down ? 'text-orange-600' : 'text-emerald-600'}`}>
                  {kpi.down ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              )}
              {kpi.pulse && <div className="pulse-dot w-2 h-2 bg-secondary-container rounded-full"></div>}
            </div>
          </div>
        ))}
      </section>

      {/* Row 2: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-surface-low p-6 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-headline font-bold text-lg text-primary">Needs by Category</h4>
            <MoreHorizontal className="text-on-surface-variant w-5 h-5" />
          </div>
          <div className="flex items-end justify-between h-48 gap-4 px-2">
            {[85, 60, 40, 70, 30].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className={`w-full rounded-t-lg transition-all ${
                    i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary-container' : 'bg-outline-variant'
                  } opacity-60 hover:opacity-100`}
                />
                <span className="text-[10px] font-bold text-on-surface-variant">
                  {['Medical', 'Food', 'Shelter', 'Logistics', 'Counseling'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-low p-6 rounded-xl relative overflow-hidden">
          <h4 className="font-headline font-bold text-lg text-primary mb-2">Daily Volume vs Resolved</h4>
          <p className="text-xs text-on-surface-variant mb-8">System performance across 24h cycle</p>
          <div className="relative h-40">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path d="M0 35 Q 20 5, 40 25 T 80 15 T 100 30" fill="none" stroke="#153328" strokeWidth="2" />
              <path d="M0 38 Q 20 15, 40 30 T 80 20 T 100 35" fill="none" stroke="#fe924e" strokeDasharray="2 2" strokeWidth="2" />
            </svg>
          </div>
          <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full"></div> Total</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-secondary-container rounded-full"></div> Resolved</div>
          </div>
        </div>
      </section>

      {/* Row 3: Zone Breakdown & AI Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-low rounded-xl overflow-hidden">
          <div className="p-6">
            <h4 className="font-headline font-bold text-lg text-primary">Zone Breakdown</h4>
          </div>
          <table className="w-full text-left">
            <thead className="bg-surface-container text-[10px] uppercase font-black text-on-surface-variant tracking-widest">
              <tr>
                <th className="px-6 py-3">Zone Name</th>
                <th className="px-6 py-3">Needs</th>
                <th className="px-6 py-3">Resolved</th>
                <th className="px-6 py-3">Resp Time</th>
                <th className="px-6 py-3">Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {[
                { name: 'North Sector Alpha', needs: 12, res: 10, time: '14m', color: 'bg-secondary' },
                { name: 'Eastern Buffer Zone', needs: 8, res: 6, time: '22m', color: 'bg-red-500 animate-pulse' },
                { name: 'Downtown Transit', needs: 3, res: 3, time: '9m', color: 'bg-emerald-500' },
              ].map((zone) => (
                <tr key={zone.name} className="hover:bg-surface-lowest transition-colors">
                  <td className="px-6 py-4 font-semibold text-sm">{zone.name}</td>
                  <td className="px-6 py-4 text-sm">{zone.needs}</td>
                  <td className="px-6 py-4 text-sm">{zone.res}</td>
                  <td className="px-6 py-4 text-sm font-bold">{zone.time}</td>
                  <td className="px-6 py-4"><div className={`w-2 h-2 rounded-full ${zone.color}`}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-4 bg-surface-lowest p-6 rounded-xl shadow-sm border-l-8 border-secondary flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-secondary w-5 h-5" />
            <h4 className="font-headline font-bold text-lg text-primary">AI Weekly Insight</h4>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed flex-1 italic">
            "Based on current velocity, Zone North Alpha will require 3 additional medical dispatchers by Thursday. Resource redirection from Downtown Transit recommended due to low volume."
          </p>
          <div className="mt-6 pt-4 border-t border-surface-low">
            <button className="text-xs font-black uppercase text-secondary flex items-center gap-1 hover:gap-2 transition-all">
              View Full Forecast <TrendingUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-surface-low p-8 rounded-xl">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-headline font-bold text-xl text-primary">Recent Activity</h4>
          <button className="text-sm font-semibold text-primary underline decoration-secondary underline-offset-4">Export Log</button>
        </div>
        <div className="space-y-6">
          {activities.map((act, i) => (
            <div key={i} className="flex items-start gap-6 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                <act.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h5 className="text-sm font-bold text-primary">{act.title}</h5>
                  <span className="text-[10px] text-on-surface-variant">{act.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{act.desc}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-[9px] font-black uppercase rounded ${act.tagColor}`}>
                  {act.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
