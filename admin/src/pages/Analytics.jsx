import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, ShoppingBag } from "lucide-react";

const salesData = [
  { month: "Jan", revenue: 12000, orders: 340, customers: 120 },
  { month: "Feb", revenue: 15500, orders: 410, customers: 145 },
  { month: "Mar", revenue: 18900, orders: 480, customers: 180 },
  { month: "Apr", revenue: 21000, orders: 525, customers: 210 },
  { month: "May", revenue: 24050, orders: 612, customers: 250 },
  { month: "Jun", revenue: 27500, orders: 690, customers: 290 },
];

const categoryData = [
  { name: "Dresses", value: 35, color: "#ef4444" },
  { name: "Bags", value: 25, color: "#f97316" },
  { name: "Jewelry", value: 20, color: "#eab308" },
  { name: "Shoes", value: 15, color: "#22c55e" },
  { name: "Accessories", value: 5, color: "#3b82f6" },
];

const topProducts = [
  { name: "Floral Summer Dress", sales: 156, revenue: 7800 },
  { name: "Leather Tote Bag", sales: 89, revenue: 7921 },
  { name: "Gold Hoop Earrings", sales: 234, revenue: 5735 },
  { name: "Knit Cardigan", sales: 67, revenue: 4354 },
];

export default function Analytics() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-zinc-400">Track your business performance and insights</p>
      </div>

      <div className="grid gap-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">Total Revenue</h3>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-white">$127,950</p>
            <p className="text-xs text-emerald-500">+12.4% from last month</p>
          </div>
          
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">Total Orders</h3>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-white">3,057</p>
            <p className="text-xs text-blue-500">+8.2% from last month</p>
          </div>
          
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">New Customers</h3>
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-white">1,295</p>
            <p className="text-xs text-purple-500">+15.3% from last month</p>
          </div>
          
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">Avg Order Value</h3>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-white">$41.85</p>
            <p className="text-xs text-rose-500">-2.1% from last month</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Sales by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
          <h3 className="font-semibold mb-4">Top Performing Products</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-zinc-400 border-b border-zinc-700">
                <tr>
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Sales</th>
                  <th className="py-3 pr-4 font-medium">Revenue</th>
                  <th className="py-3 pr-4 font-medium">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.name} className="border-t border-zinc-700">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-white">{product.sales} units</td>
                    <td className="py-4 pr-4 font-semibold text-white">${product.revenue.toLocaleString()}</td>
                    <td className="py-4 pr-4">
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${(product.sales / 250) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}