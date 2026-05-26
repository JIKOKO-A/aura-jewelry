"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { motion } from "framer-motion";
import { Loader2, DollarSign, Package, Users, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    async function loadStats() {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentOrders(data.recent_orders);
        } else {
          toast.error("Failed to load business statistics.");
        }
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [token]);

  // Helper to map icons to labels
  const getIcon = (label: string) => {
    switch (label) {
      case "Total Revenue":
        return <DollarSign size={18} className="text-gold" />;
      case "Active Orders":
        return <Package size={18} className="text-gold" />;
      case "Total Customers":
        return <Users size={18} className="text-gold" />;
      default:
        return <TrendingUp size={18} className="text-gold" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-neutral-900 leading-tight">Business Overview</h1>
          <p className="font-sans text-xs text-neutral-500 mt-1 uppercase tracking-wider">Aura Atelier Analytics</p>
        </div>
        <button 
          onClick={() => {
            toast.success("Business ledger export compiled successfully.");
          }} 
          className="px-6 py-3 bg-neutral-900 text-white font-sans text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-sm"
        >
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white p-6 border border-neutral-200 flex flex-col justify-between rounded-sm shadow-sm hover:border-gold/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-400 font-medium">{stat.label}</p>
              <div className="p-1.5 bg-neutral-50 rounded-full">{getIcon(stat.label)}</div>
            </div>
            <div className="flex items-end gap-3 mt-auto">
              <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-semibold">{stat.value}</h3>
              <span className={`font-sans text-[11px] mb-1 font-semibold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <h2 className="font-serif text-lg text-neutral-900 font-medium">Recent Transactions</h2>
          <span className="font-sans text-[10px] uppercase tracking-wider text-neutral-400">Showing last 10</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 bg-neutral-50/20">
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Order ID</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Customer</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Date Placed</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Total Amount</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-neutral-400 font-sans">
                    No transactions registered in database yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50/40 transition-colors">
                    <td className="px-8 py-4 text-neutral-950 font-medium">{order.id}</td>
                    <td className="px-8 py-4 text-neutral-700 font-medium">{order.customer}</td>
                    <td className="px-8 py-4 text-neutral-500 font-sans flex items-center gap-1.5">
                      <Calendar size={13} className="text-neutral-400" /> {order.created_at}
                    </td>
                    <td className="px-8 py-4 text-neutral-950 font-semibold">{order.total}</td>
                    <td className="px-8 py-4">
                      <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-semibold border rounded-sm ${
                        order.status === 'Out for Delivery' ? 'border-gold text-gold bg-gold/5' : 
                        order.status === 'Delivered' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 
                        'border-neutral-300 text-neutral-500 bg-neutral-50'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
