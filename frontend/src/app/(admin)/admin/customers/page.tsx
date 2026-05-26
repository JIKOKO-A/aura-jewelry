"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { Loader2, Search, UserCheck, Mail, Calendar, Coins } from "lucide-react";
import { toast } from "sonner";

export default function AdminCustomers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    async function loadCustomers() {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/admin/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        } else {
          toast.error("Failed to load customer catalog.");
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [token]);

  // Search logic
  const filteredCustomers = customers.filter((cust) => {
    const query = searchQuery.toLowerCase();
    return (
      cust.name.toLowerCase().includes(query) ||
      cust.email.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-10 text-neutral-800">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-neutral-900 leading-tight">Customer Ledger</h1>
        <p className="font-sans text-xs text-neutral-500 mt-1 uppercase tracking-wider">Review profiles, purchases, and VIP status</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-neutral-200 rounded-sm shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Search customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-sm font-sans text-xs focus:outline-none focus:border-gold"
          />
        </div>
        <div className="font-sans text-xs text-neutral-400 font-medium">
          Total Registered: <strong className="text-neutral-700">{customers.length} profiles</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="font-serif text-lg text-neutral-900 font-medium">Client Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 bg-neutral-50/20">
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Client Name</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Email Coordinates</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Purchase Count</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Total Investment</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Aura Points</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-neutral-400 font-sans">
                    No client profiles registered in database match search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors">
                    {/* Name */}
                    <td className="px-8 py-4">
                      <span className="flex items-center gap-2 font-serif text-sm font-semibold text-neutral-950">
                        <UserCheck size={14} className="text-gold" /> {cust.name}
                      </span>
                    </td>
                    {/* Email */}
                    <td className="px-8 py-4">
                      <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                        <Mail size={13} className="text-neutral-400" /> {cust.email}
                      </span>
                    </td>
                    {/* Orders count */}
                    <td className="px-8 py-4 text-neutral-700 font-semibold">{cust.order_count} orders</td>
                    {/* Total spent */}
                    <td className="px-8 py-4 text-neutral-950 font-bold">{cust.total_spent}</td>
                    {/* Aura Points */}
                    <td className="px-8 py-4">
                      <span className="flex items-center gap-1 text-gold font-semibold font-sans">
                        <Coins size={13} /> {cust.aura_points} pts
                      </span>
                    </td>
                    {/* Signed up date */}
                    <td className="px-8 py-4 text-neutral-500 font-sans flex items-center gap-1.5">
                      <Calendar size={13} className="text-neutral-400" /> {cust.created_at}
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
