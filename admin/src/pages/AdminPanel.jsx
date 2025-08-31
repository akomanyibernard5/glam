import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  LayoutGrid,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Package2,
  MessageSquare,
} from "lucide-react";

import { NavLink } from "../components/NavLink";
import { useToast } from "../components/Toast";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";
import Customers from "./Customers";
import Analytics from "./Analytics";
import Messages from "./Messages";
import SettingsPage from "./Settings";

export default function AdminPanel() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [query, setQuery] = useState("");
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "orders":
        return <Orders />;
      case "products":
        return <Products />;
      case "customers":
        return <Customers />;
      case "analytics":
        return <Analytics />;
      case "messages":
        return <Messages />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-700 p-6 z-40">
        <div className="flex items-center gap-2 font-semibold text-lg mb-8 cursor-pointer">
          <img src="/src/assets/logo.svg" alt="Ladies Glam" className="h-8 w-8 rounded-xl filter brightness-0 invert" />
          Ladies Glam Admin
        </div>
        <nav className="space-y-2">
          <NavLink 
            active={currentPage === "dashboard"} 
            icon={LayoutGrid} 
            label="Dashboard" 
            onClick={() => setCurrentPage("dashboard")}
          />
          <NavLink 
            active={currentPage === "orders"} 
            icon={ShoppingBag} 
            label="Orders" 
            onClick={() => setCurrentPage("orders")}
          />
          <NavLink 
            active={currentPage === "products"} 
            icon={Package2} 
            label="Products" 
            onClick={() => setCurrentPage("products")}
          />
          <NavLink 
            active={currentPage === "customers"} 
            icon={Users} 
            label="Customers" 
            onClick={() => setCurrentPage("customers")}
          />
          <NavLink 
            active={currentPage === "analytics"} 
            icon={BarChart3} 
            label="Analytics" 
            onClick={() => setCurrentPage("analytics")}
          />
          <NavLink 
            active={currentPage === "messages"} 
            icon={MessageSquare} 
            label="Messages" 
            onClick={() => setCurrentPage("messages")}
          />
          <NavLink 
            active={currentPage === "settings"} 
            icon={Settings} 
            label="Settings" 
            onClick={() => setCurrentPage("settings")}
          />
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <NavLink 
            icon={LogOut} 
            label="Logout" 
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-zinc-700 bg-zinc-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2">
                <Search className="h-4 w-4" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, orders, customers..."
                  className="bg-transparent outline-none text-sm w-72 placeholder:text-zinc-400 text-white"
                />
              </div>
              <button 
                onClick={() => showToast('You have 3 new notifications', 'info')}
                className="p-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 cursor-pointer relative text-white"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">3</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {renderPage()}


      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}