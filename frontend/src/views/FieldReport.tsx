import { motion } from 'motion/react';
import { Mic, Send, Map as MapIcon, Brain, Droplets, Navigation, ShieldAlert, Sparkles } from 'lucide-react';

export default function FieldReport() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header>
        <h1 className="font-headline font-extrabold text-4xl lg:text-5xl text-primary tracking-tight mb-2">What's happening, Priya?</h1>
        <p className="text-on-surface-variant font-medium text-lg">Your field observations provide the ground truth for our response.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section className="bg-surface-lowest rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline font-bold text-xl text-primary flex items-center gap-2">
                <Mic className="text-secondary w-5 h-5" />
                Voice Reporting
              </h2>
              <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Auto-Language Detection</span>
            </div>
            <div className="flex flex-col items-center justify-center py-12 gap-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-lg relative"
              >
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                <Mic className="w-10 h-10" />
              </motion.button>
              <p className="font-body text-on-surface-variant text-center max-w-xs">
                Tap to begin speaking. AI automatically detects Telugu, Hindi, Tamil, or English for instant transcription of needs and location.
              </p>
              <div className="flex items-center gap-1.5 h-8">
                {[4, 6, 3, 8, 5, 7, 4].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h * 4}px`, `${h * 6}px`, `${h * 4}px`] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1.5 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-surface-low rounded-xl p-8">
            <h2 className="font-headline font-bold text-xl text-primary mb-6">Manual Entry</h2>
            <div className="relative group">
              <textarea
                className="w-full h-48 bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-colors p-4 font-body text-on-surface rounded-t-lg resize-none"
                placeholder="Type your field report here if you prefer manual entry..."
              />
              <div className="absolute bottom-4 right-4">
                <button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all">
                  <span>Analyze Report</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="lg:col-span-5 flex flex-col gap-8">
          <section className="glass-panel rounded-xl p-8 border border-white/40 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="text-secondary w-6 h-6" />
              <h2 className="font-headline font-bold text-xl text-primary">Extracted Insights</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-surface-lowest p-4 rounded-lg flex items-start gap-4">
                <div className="bg-secondary/10 text-secondary p-2 rounded-lg">
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Primary Need</p>
                  <p className="font-bold text-primary text-lg">Clean Water Access</p>
                  <p className="text-on-surface-variant text-sm mt-1">Identified need for 500L/day in sector B-4.</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">94% MATCH</span>
              </div>

              <div className="bg-surface-lowest p-4 rounded-lg flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Location Context</p>
                  <p className="font-bold text-primary text-lg">Northeast Perimeter</p>
                  <p className="text-on-surface-variant text-sm mt-1">Detected vicinity to river crossing points.</p>
                </div>
              </div>

              <div className="bg-surface-lowest p-4 rounded-lg flex items-start gap-4">
                <div className="bg-red-50 text-red-700 p-2 rounded-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">Priority</p>
                  <p className="font-bold text-primary text-lg">Urgent Deployment</p>
                  <p className="text-on-surface-variant text-sm mt-1">Recommended timeframe: Within 6 hours.</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 bg-secondary text-white font-headline font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3">
              Deploy Resources
              <Send className="w-4 h-4" />
            </button>
          </section>

          <section className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="font-headline font-bold text-primary flex items-center gap-2">
                <MapIcon className="w-5 h-5" />
                Ground Truth Context
              </h3>
            </div>
            <div className="h-48 w-full bg-surface-container relative">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Map"
                className="w-full h-full object-cover opacity-50 mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-secondary rounded-full pulse-dot"></div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
