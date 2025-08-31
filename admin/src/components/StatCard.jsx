import { motion } from "framer-motion";

export function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && <p className="text-xs mt-3 text-emerald-600 dark:text-emerald-500">{trend}</p>}
    </motion.div>
  );
}