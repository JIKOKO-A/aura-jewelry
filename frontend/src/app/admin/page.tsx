"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, ShoppingCart, Users, PackageSearch, BarChart3, Settings, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tabs = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Orders", icon: ShoppingCart },
    { name: "Products", icon: PackageSearch },
    { name: "Customers", icon: Users },
    { name: "Analytics", icon: BarChart3 },
  ];

  const stats = [
    { label: "Total Revenue", value: "$45,231.00", trend: "+12.5%", icon: DollarSign },
    { label: "Active Orders", value: "34", trend: "+4.2%", icon: ShoppingCart },
    { label: "Conversion Rate", value: "3.24%", trend: "-0.8%", icon: TrendingUp },
    { label: "Total Customers", value: "1,429", trend: "+18.1%", icon: Users },
  ];

  const recentOrders = [
    { id: "#AURA-4921", customer: "Sarah Jenkins", total: "$2,400.00", status: "Out for Delivery" },
    { id: "#AURA-4920", customer: "Michael Chen", total: "$850.00", status: "Processing" },
    { id: "#AURA-4919", customer: "Emma Watson", total: "$3,200.00", status: "Shipped" },
    { id: "#AURA-4918", customer: "Olivia Davis", total: "$450.00", status: "Delivered" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-foreground/10 flex flex-col h-screen sticky top-0">
        <div className="p-8 border-b border-foreground/10">
          <Link href="/" className="font-serif text-2xl tracking-widest text-foreground font-semibold">AURA</Link>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-1 px-4">
          {tabs.map((tab) => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-sans rounded-sm transition-colors ${
                activeTab === tab.name 
                  ? "bg-foreground text-background" 
                  : "text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              <tab.icon size={16} /> {tab.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-foreground/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-foreground/70 hover:bg-foreground/5 rounded-sm"><Settings size={16} /> Settings</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-3xl text-foreground">{activeTab === "Dashboard" ? "Business Overview" : activeTab}</h1>
          <button onClick={() => alert("Report download started.")} className="px-6 py-3 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors">
            Export Report
          </button>
        </div>

        {activeTab === "Dashboard" ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background p-6 border border-foreground/10 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-sans text-xs uppercase tracking-widest text-foreground/50">{stat.label}</p>
                    <stat.icon size={16} className="text-foreground/40" />
                  </div>
                  <div className="flex items-end gap-3 mt-auto">
                    <h3 className="font-serif text-3xl text-foreground">{stat.value}</h3>
                    <span className={`font-sans text-xs mb-1 ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-background border border-foreground/10 overflow-hidden">
              <div className="px-8 py-6 border-b border-foreground/10 flex justify-between items-center">
                <h2 className="font-serif text-xl text-foreground">Recent Transactions</h2>
                <button onClick={() => setActiveTab("Orders")} className="font-sans text-xs uppercase tracking-widest text-gold hover:text-foreground transition-colors">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-foreground/5 text-foreground/50">
                      <th className="px-8 py-4 font-normal uppercase tracking-widest text-xs">Order ID</th>
                      <th className="px-8 py-4 font-normal uppercase tracking-widest text-xs">Customer</th>
                      <th className="px-8 py-4 font-normal uppercase tracking-widest text-xs">Total</th>
                      <th className="px-8 py-4 font-normal uppercase tracking-widest text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={i} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                        <td className="px-8 py-4 text-foreground">{order.id}</td>
                        <td className="px-8 py-4 text-foreground/80">{order.customer}</td>
                        <td className="px-8 py-4 text-foreground">{order.total}</td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 text-[10px] uppercase tracking-widest border ${
                            order.status === 'Out for Delivery' ? 'border-gold text-gold bg-gold/5' : 
                            order.status === 'Delivered' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 
                            'border-foreground/20 text-foreground/70'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-foreground/20 text-center">
            <p className="font-sans text-foreground/50">{activeTab} section is currently empty.</p>
          </div>
        )}
      </div>
    </main>
  );
}
