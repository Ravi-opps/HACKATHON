import { motion } from 'motion/react';
import { MapPin, Clock, CheckCircle, Verified, Sparkles, Activity } from 'lucide-react';

const pastImpact = [
  { date: 'Oct 12', title: 'Water Distribution', location: 'Madhapur Area Dispatch', duration: '4.5 Hours' },
  { date: 'Oct 08', title: 'Crowd Control', location: 'Gachibowli Relief Center', duration: '6 Hours' },
  { date: 'Sep 29', title: 'Translation Support', location: 'Multilingual Hub - Jubilee Hills', duration: '3 Hours' },
];

export default function VolunteerDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tight">Welcome back, Ravi</h2>
          <p className="text-on-surface-variant font-medium">Ready to support the community today?</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-low px-4 py-2 rounded-full">
          <span className="text-xs font-bold text-primary">STATUS: AVAILABLE</span>
          <div className="w-10 h-5 bg-primary rounded-full relative">
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Hero Card */}
        <section className="col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-[#E07B39] text-white p-8 flex flex-col justify-between h-72 shadow-lg group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10">
              <Activity className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                  <div className="pulse-dot w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-[10px] font-bold tracking-widest uppercase">Critical Urgency</span>
                </div>
                <span className="text-white/80 text-sm">New Assignment Near You</span>
              </div>
              <h3 className="font-headline text-4xl font-extrabold mb-2">Flood Relief — Food + Medical</h3>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Kukatpally, 2.1 km away</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Immediate response requested</span>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex gap-4 mt-6">
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold font-headline transition-all hover:shadow-xl active:scale-95">
                Accept Assignment
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-xl font-bold font-headline transition-all hover:bg-white/20">
                Decline
              </button>
            </div>
          </motion.div>

          {/* Map Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline text-xl font-bold text-primary">Active Assignment Route</h4>
              <div className="text-primary font-bold bg-primary-fixed-dim px-3 py-1 rounded-lg text-sm">ETA: 12 mins</div>
            </div>
            <div className="bg-surface-lowest rounded-2xl overflow-hidden shadow-sm">
              <div className="h-64 relative bg-surface-container">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
                  alt="Map"
                  className="w-full h-full object-cover opacity-50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 glass-panel px-3 py-2 rounded-lg shadow-md border-l-4 border-primary">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase leading-none">Destination</p>
                  <p className="text-sm font-bold text-primary">Kukatpally Relief Camp</p>
                </div>
              </div>
              <div className="p-4 bg-surface-lowest">
                <button className="w-full bg-primary-container text-white py-4 rounded-xl font-headline font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-primary transition-all">
                  <CheckCircle className="w-6 h-6" />
                  Mark as Arrived
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column */}
        <section className="col-span-4 space-y-8">
          <div className="bg-surface-low rounded-2xl p-6">
            <h4 className="font-headline font-bold text-lg text-primary mb-4 flex items-center gap-2">
              <Verified className="text-secondary w-5 h-5" />
              Your Verified Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {['First Aid', 'Medical', 'Telugu', 'English'].map(skill => (
                <span key={skill} className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
            <button className="mt-6 w-full text-center text-xs font-bold text-secondary hover:underline">
              + Add or Verify Skills
            </button>
          </div>

          <div className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Sparkles className="w-24 h-24" />
            </div>
            <h4 className="font-headline font-bold text-lg mb-6">Impact Stats</h4>
            <div className="space-y-6">
              {[
                { label: 'Assignments Completed', value: '12' },
                { label: 'Hours Contributed', value: '34' },
                { label: 'Zones Helped', value: '4' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <span className="text-white/70 text-sm">{stat.label}</span>
                  <span className="text-2xl font-headline font-extrabold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-l-4 border-secondary shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="pulse-dot w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Live Activity</span>
            </div>
            <p className="text-sm font-medium text-primary">Emergency medical supplies moving through Zone-B</p>
            <p className="text-[10px] text-on-surface-variant mt-1">Updated 2 mins ago</p>
          </div>
        </section>

        {/* Past Impact */}
        <section className="col-span-12">
          <div className="bg-surface-low rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline text-2xl font-extrabold text-primary">Past Impact</h4>
              <button className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">View All History</button>
            </div>
            <div className="space-y-4">
              {pastImpact.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="bg-surface-lowest p-4 rounded-xl flex items-center justify-between group hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="bg-surface-container p-3 rounded-lg text-on-surface-variant font-bold text-xs flex flex-col items-center min-w-[64px]">
                      <span className="text-[10px] uppercase opacity-60">{item.date.split(' ')[0]}</span>
                      <span className="text-lg leading-tight text-primary">{item.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-primary">{item.title}</h5>
                      <p className="text-sm text-on-surface-variant">{item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-bold text-on-surface-variant uppercase">Duration</p>
                      <p className="text-sm font-medium text-primary">{item.duration}</p>
                    </div>
                    <div className="text-emerald-600">
                      <CheckCircle className="w-6 h-6 fill-current opacity-20" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
