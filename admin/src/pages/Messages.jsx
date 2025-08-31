import React, { useState } from "react";
import { Search, Reply, Archive, Star } from "lucide-react";
import { useToast } from "../components/Toast";

const messages = [
  { 
    id: 1, 
    customer: "Ama Boateng", 
    email: "ama.boateng@email.com", 
    subject: "Question about dress sizing", 
    message: "Hi, I'm interested in the Floral Summer Dress but I'm not sure about the sizing. Could you help me with the size chart?",
    date: "2025-01-15T10:30:00",
    read: false,
    starred: true
  },
  { 
    id: 2, 
    customer: "Nadia Mensah", 
    email: "nadia.mensah@email.com", 
    subject: "Order delivery issue", 
    message: "My order #10233 was supposed to arrive yesterday but I haven't received it yet. Can you please check the status?",
    date: "2025-01-15T09:15:00",
    read: true,
    starred: false
  },
  { 
    id: 3, 
    customer: "Yaa Serwaa", 
    email: "yaa.serwaa@email.com", 
    subject: "Product return request", 
    message: "I received the leather bag but it's not the color I expected. How can I return it for a different color?",
    date: "2025-01-14T16:45:00",
    read: false,
    starred: false
  },
  { 
    id: 4, 
    customer: "Adwoa K.", 
    email: "adwoa.k@email.com", 
    subject: "Thank you!", 
    message: "Just wanted to say thank you for the excellent customer service. The earrings are beautiful!",
    date: "2025-01-14T14:20:00",
    read: true,
    starred: true
  },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { showToast } = useToast();

  const handleReply = () => {
    showToast('Reply sent successfully', 'success');
  };

  const handleArchive = () => {
    showToast('Message archived', 'info');
  };

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <p className="text-zinc-400">Customer inquiries and communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2">
                <Search className="h-4 w-4" />
                <input
                  placeholder="Search messages..."
                  className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-400 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-colors",
                    selectedMessage?.id === message.id ? "bg-zinc-700" : "hover:bg-zinc-700",
                    !message.read && "border-l-2 border-blue-500"
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={cn("font-medium text-sm", !message.read && "text-white font-semibold")}>
                      {message.customer}
                    </h4>
                    <div className="flex items-center gap-1">
                      {message.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      <span className="text-xs text-zinc-400">
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mb-1">{message.subject}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-6">
            {selectedMessage ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{selectedMessage.subject}</h2>
                    <p className="text-sm text-zinc-400">
                      From: {selectedMessage.customer} ({selectedMessage.email})
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(selectedMessage.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReply}
                      className="px-3 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                    >
                      <Reply className="h-4 w-4" />
                      Reply
                    </button>
                    <button
                      onClick={handleArchive}
                      className="px-3 py-2 rounded-xl border border-zinc-600 hover:bg-zinc-700 cursor-pointer text-white flex items-center gap-2"
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </button>
                  </div>
                </div>
                
                <div className="bg-zinc-900 rounded-xl p-4 mb-4">
                  <p className="text-white leading-relaxed">{selectedMessage.message}</p>
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <h3 className="font-medium mb-3">Reply</h3>
                  <textarea
                    rows={4}
                    placeholder="Type your reply..."
                    className="w-full px-3 py-2 rounded-xl border border-zinc-600 bg-zinc-700 text-white placeholder:text-zinc-400 mb-3"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleReply}
                      className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-zinc-400">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}