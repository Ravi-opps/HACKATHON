import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-surface flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Leaf className="text-white w-12 h-12 fill-current" />
          </motion.div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary uppercase">GROUNDPULSE</h1>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] mt-1">Crisis Response Ecosystem</p>
        </div>
      </motion.div>
    </div>
  );
}
