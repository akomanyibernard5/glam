import React, { useState } from "react";
import { Save, User, Bell, Shield } from "lucide-react";
import { useToast } from "../components/Toast";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { showToast } = useToast();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-black"
                        : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="User"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="admin@ladiesglam.com"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      defaultValue="Administrator of Ladies Glam fashion store"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "New Orders", desc: "Get notified when new orders are placed" },
                    { label: "Low Stock Alerts", desc: "Receive alerts when products are running low" },
                    { label: "Customer Messages", desc: "Notifications for customer inquiries" },
                    { label: "Weekly Reports", desc: "Receive weekly performance reports" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-zinc-700">
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-zinc-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>
            )}



            <div className="flex justify-end mt-6 pt-6 border-t border-zinc-700">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}