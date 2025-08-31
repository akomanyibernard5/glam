import React from "react";
import { Search, Filter, Download } from "lucide-react";

const orders = [
  { id: "#10234", customer: "Ama Boateng", total: 132.45, status: "Shipped", date: "2025-08-28", items: 3 },
  { id: "#10233", customer: "Nadia Mensah", total: 58.99, status: "Processing", date: "2025-08-28", items: 1 },
  { id: "#10232", customer: "Yaa Serwaa", total: 302.1, status: "Delivered", date: "2025-08-27", items: 5 },
  { id: "#10231", customer: "Adwoa K.", total: 84.2, status: "Cancelled", date: "2025-08-27", items: 2 },
  { id: "#10230", customer: "Akosua M.", total: 156.75, status: "Delivered", date: "2025-08-26", items: 4 },
  { id: "#10229", customer: "Efua A.", total: 89.50, status: "Shipped", date: "2025-08-26", items: 2 },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Orders() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Orders</h1>
        <p className="text-zinc-400">Manage and track all customer orders</p>
      </div>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2">
              <Search className="h-4 w-4" />
              <input
                placeholder="Search orders..."
                className="bg-transparent outline-none text-sm w-64 placeholder:text-zinc-400 text-white"
              />
            </div>
            <button className="px-3 py-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 cursor-pointer text-white flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
          <button className="px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-400 border-b border-zinc-700">
              <tr>
                <th className="py-3 pr-4 font-medium">Order ID</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Items</th>
                <th className="py-3 pr-4 font-medium">Total</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-zinc-700 cursor-pointer hover:bg-zinc-700">
                  <td className="py-4 pr-4 font-medium text-white">{order.id}</td>
                  <td className="py-4 pr-4 text-white">{order.customer}</td>
                  <td className="py-4 pr-4 text-zinc-300">{order.items} items</td>
                  <td className="py-4 pr-4 font-semibold text-white">${order.total.toFixed(2)}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        order.status === "Delivered" && "bg-emerald-100 text-emerald-700",
                        order.status === "Shipped" && "bg-blue-100 text-blue-700",
                        order.status === "Processing" && "bg-amber-100 text-amber-700",
                        order.status === "Cancelled" && "bg-rose-100 text-rose-700"
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-zinc-300">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-4 pr-4">
                    <button className="text-xs px-2 py-1 rounded-lg border border-zinc-600 hover:bg-zinc-700 cursor-pointer text-white">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}