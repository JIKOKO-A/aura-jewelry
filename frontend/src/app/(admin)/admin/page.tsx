"use client";

import { motion } from "framer-motion";
import { adminStats, adminRecentOrders } from "@/lib/data";

export default function AdminDashboard() {
  return (
    <div className="p-8 md:p-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-3xl text-foreground">Business Overview</h1>
        <button onClick={() => alert("Report download started.")} className="px-6 py-3 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors">
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {adminStats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background p-6 border border-foreground/10 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="font-sans text-xs uppercase tracking-widest text-foreground/50">{stat.label}</p>
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
              {adminRecentOrders.map((order, i) => (
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
    </div>
  );
}
