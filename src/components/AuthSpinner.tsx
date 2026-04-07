import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function AuthSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-surface/80 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center bg-surface-container rounded-2xl p-8 shadow-2xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Loader2 className="text-primary w-8 h-8" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
