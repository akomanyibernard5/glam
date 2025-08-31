import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, DollarSign, ShoppingBag, Package2, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { StatCard } from "../components/StatCard";
import { AddProductModal } from "../components/AddProductModal";
import { useToast } from "../components/Toast";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const sales = [
  { month: "Jan", revenue: 12000, orders: 340 },
  { month: "Feb", revenue: 15500, orders: 410 },
  { month: "Mar", revenue: 18900, orders: 480 },
  { month: "Apr", revenue: 21000, orders: 525 },
  { month: "May", revenue: 24050, orders: 612 },
  { month: "Jun", revenue: 27500, orders: 690 },
];

const recentOrders = [
  { id: "#10234", customer: "Ama Boateng", total: 132.45, status: "Shipped", date: "2025-08-28" },
  { id: "#10233", customer: "Nadia Mensah", total: 58.99, status: "Processing", date: "2025-08-28" },
  { id: "#10232", customer: "Yaa Serwaa", total: 302.1, status: "Delivered", date: "2025-08-27" },
  { id: "#10231", customer: "Adwoa K.", total: 84.2, status: "Cancelled", date: "2025-08-27" },
];

const products = [
  { id: 1, name: "Floral Summer Dress", price: 49.99, stock: 34, img: "https:
  { id: 2, name: "Leather Tote Bag", price: 89.0, stock: 12, img: "https:
  { id: 3, name: "Gold Hoop Earrings", price: 24.5, stock: 77, img: "https:
  { id: 4, name: "Knit Cardigan", price: 64.99, stock: 8, img: "https:
];

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [productList, setProductList] = useState(products);
  const { showToast } = useToast();

  const kpis = useMemo(() => ([
    { title: "Revenue", value: "$" + Intl.NumberFormat().format(27500), icon: DollarSign, trend: "+12.4% vs last month" },
    { title: "Orders", value: "690", icon: ShoppingBag, trend: "+6.1%" },
    { title: "Products", value: String(productList.length), icon: Package2, trend: "4 low stock" },
    { title: "Delivered", value: "542", icon: CheckCircle2, trend: "+3.2%" },
  ]), [productList.length]);

  const filtered = productList.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="p-6 grid gap-6">
      {}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.title} className="cursor-pointer">
            <StatCard title={k.title} value={k.value} icon={k.icon} trend={k.trend} />
          </div>
        ))}
      </section>

      {}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-zinc-700 bg-zinc-800 p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue vs Orders</h3>
            <div className="text-sm text-zinc-500">Last 6 months</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Orders by Status</h3>
            <div className="text-sm text-zinc-500">This month</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ s: "Delivered", v: 320 }, { s: "Shipped", v: 210 }, { s: "Processing", v: 105 }, { s: "Cancelled", v: 55 }]}> 
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="s" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="v" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {}
      <section className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between mb-4">
          <h3 className="font-semibold">Products</h3>
          <div className="flex items-center gap-2">
            <div className="flex md:hidden items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2">
              <Search className="h-4 w-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="bg-transparent outline-none text-sm w-48 placeholder:text-zinc-500"
              />
            </div>
            <button
              onClick={() => showToast('Opening products page', 'info')}
              className="px-3 py-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 cursor-pointer text-white"
            >
              View All
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> New Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <p className="font-medium line-clamp-1">{p.name}</p>
                <div className="flex items-center justify-between mt-1 text-sm">
                  <span className="font-semibold">${p.price.toFixed(2)}</span>
                  <span className={cn("px-2 py-0.5 rounded-lg", p.stock < 10 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700")}>{p.stock} in stock</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button 
                    onClick={() => showToast('Product edited successfully', 'success')}
                    className="flex-1 text-xs rounded-lg border border-zinc-600 px-2 py-1.5 hover:bg-zinc-700 cursor-pointer transition-colors text-white"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => showToast('Opening product details', 'info')}
                    className="flex-1 text-xs rounded-lg bg-black text-white hover:bg-zinc-800 px-2 py-1.5 cursor-pointer transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {}
      <section className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Orders</h3>
          <button className="px-3 py-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 cursor-pointer text-white">View all</button>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Order ID</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-zinc-700 cursor-pointer hover:bg-zinc-700">
                  <td className="py-3 pr-4 font-medium">{o.id}</td>
                  <td className="py-3 pr-4">{o.customer}</td>
                  <td className="py-3 pr-4">${o.total.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-lg text-xs",
                        o.status === "Delivered" && "bg-emerald-100 text-emerald-700",
                        o.status === "Shipped" && "bg-blue-100 text-blue-700",
                        o.status === "Processing" && "bg-amber-100 text-amber-700",
                        o.status === "Cancelled" && "bg-rose-100 text-rose-700"
                      )}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{new Date(o.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AddProductModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(p) => {
          setProductList((prev) => [p, ...prev]);
          showToast('Product added successfully!', 'success');
        }}
      />
    </main>
  );
}