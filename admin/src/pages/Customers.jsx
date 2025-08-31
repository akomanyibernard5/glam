import React from "react";
import { Search, Filter, UserPlus } from "lucide-react";

const customers = [
  { id: 1, name: "Ama Boateng", email: "ama.boateng@email.com", orders: 12, spent: 1250.45, joined: "2024-01-15", status: "Active" },
  { id: 2, name: "Nadia Mensah", email: "nadia.mensah@email.com", orders: 8, spent: 890.30, joined: "2024-02-20", status: "Active" },
  { id: 3, name: "Yaa Serwaa", email: "yaa.serwaa@email.com", orders: 15, spent: 2100.75, joined: "2023-11-10", status: "VIP" },
  { id: 4, name: "Adwoa K.", email: "adwoa.k@email.com", orders: 3, spent: 245.60, joined: "2024-03-05", status: "New" },
  { id: 5, name: "Akosua M.", email: "akosua.m@email.com", orders: 20, spent: 3200.90, joined: "2023-08-12", status: "VIP" },
  { id: 6, name: "Efua A.", email: "efua.a@email.com", orders: 6, spent: 567.25, joined: "2024-01-28", status: "Active" },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Customers() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Customers</h1>
        <p className="text-zinc-400">Manage your customer relationships</p>
      </div>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2">
              <Search className="h-4 w-4" />
              <input
                placeholder="Search customers..."
                className="bg-transparent outline-none text-sm w-64 placeholder:text-zinc-400 text-white"
              />
            </div>
            <button className="px-3 py-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 cursor-pointer text-white flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
          <button className="px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Customer
          </button>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-400 border-b border-zinc-700">
              <tr>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Orders</th>
                <th className="py-3 pr-4 font-medium">Total Spent</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Joined</th>
                <th className="py-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-zinc-700 cursor-pointer hover:bg-zinc-700">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center text-white text-sm font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-zinc-300">{customer.email}</td>
                  <td className="py-4 pr-4 text-white">{customer.orders}</td>
                  <td className="py-4 pr-4 font-semibold text-white">${customer.spent.toFixed(2)}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        customer.status === "VIP" && "bg-purple-100 text-purple-700",
                        customer.status === "Active" && "bg-emerald-100 text-emerald-700",
                        customer.status === "New" && "bg-blue-100 text-blue-700"
                      )}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-zinc-300">{new Date(customer.joined).toLocaleDateString()}</td>
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