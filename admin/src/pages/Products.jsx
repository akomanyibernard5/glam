import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter } from "lucide-react";
import { AddProductModal } from "../components/AddProductModal";
import { useToast } from "../components/Toast";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const initialProducts = [
  { id: 1, name: "Floral Summer Dress", price: 49.99, stock: 34, category: "Dresses", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, name: "Leather Tote Bag", price: 89.0, stock: 12, category: "Bags", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, name: "Gold Hoop Earrings", price: 24.5, stock: 77, category: "Jewelry", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, name: "Knit Cardigan", price: 64.99, stock: 8, category: "Clothing", img: "https://images.unsplash.com/photo-1456327102063-fb5054efe647?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, name: "Silk Scarf", price: 35.00, stock: 25, category: "Accessories", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop" },
  { id: 6, name: "High Heel Pumps", price: 120.00, stock: 15, category: "Shoes", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop" },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const { showToast } = useToast();

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Products</h1>
        <p className="text-zinc-400">Manage your product inventory</p>
      </div>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm w-64 placeholder:text-zinc-400 text-white"
              />
            </div>
            <button className="px-3 py-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 cursor-pointer text-white flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900 cursor-pointer hover:border-zinc-600 transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <p className="font-medium text-white line-clamp-1">{product.name}</p>
                  <p className="text-xs text-zinc-400">{product.category}</p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">${product.price.toFixed(2)}</span>
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium",
                    product.stock < 10 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {product.stock} in stock
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showToast('Product edited successfully', 'success')}
                    className="flex-1 text-xs rounded-lg border border-zinc-600 px-3 py-2 hover:bg-zinc-700 cursor-pointer transition-colors text-white"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => showToast('Opening product details', 'info')}
                    className="flex-1 text-xs rounded-lg bg-black text-white hover:bg-zinc-800 px-3 py-2 cursor-pointer transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">No products found matching your search.</p>
          </div>
        )}
      </div>

      <AddProductModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(product) => {
          setProducts((prev) => [{ ...product, id: Date.now() }, ...prev]);
          showToast('Product added successfully!', 'success');
        }}
      />
    </main>
  );
}