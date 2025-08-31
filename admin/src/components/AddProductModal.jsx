import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export function AddProductModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  
  if (!open) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        key="modal"
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 grid place-items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <div
          className="w-[95vw] max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold">Add Product</h3>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Name</span>
              <input
                className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-zinc-800/80 border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Satin Maxi Dress"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Price ($)</span>
                <input
                  type="number"
                  className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-zinc-800/80 border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="49.99"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Stock</span>
                <input
                  type="number"
                  className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-zinc-800/80 border-black/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="25"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAdd({ id: Date.now(), name: form.name, price: parseFloat(form.price), stock: parseInt(form.stock) });
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}