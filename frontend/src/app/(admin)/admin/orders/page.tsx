"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { Loader2, Search, ArrowUpDown, Clock, MapPin, Phone, Mail, FileText } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      toast.error("Failed to load orders from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success("Order status updated successfully.");
        // Refresh local state
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Database connection error.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.order_number.toLowerCase().includes(query) ||
      `${order.first_name} ${order.last_name}`.toLowerCase().includes(query) ||
      order.city.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query);
      
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  const statusOptions = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

  return (
    <div className="p-8 md:p-12 space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-neutral-900 leading-tight">Order Fulfilment</h1>
        <p className="font-sans text-xs text-neutral-500 mt-1 uppercase tracking-wider">Manage deliveries and payment audits</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-neutral-200 rounded-sm shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Search order ID, client, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-sm font-sans text-xs focus:outline-none focus:border-gold"
          />
        </div>

        {/* Filter Tab pills */}
        <div className="flex flex-wrap gap-2">
          {["All", "Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider transition-colors rounded-sm border ${
                filterStatus === status
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-transparent text-neutral-500 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="py-20 bg-white text-center border border-neutral-200 rounded-sm font-sans text-neutral-400">
            No customer orders matching the active criteria.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white border border-neutral-200 rounded-sm shadow-sm p-6 space-y-6 hover:border-neutral-300 transition-colors"
            >
              {/* Order Info Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-100 pb-4 gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-serif text-lg font-bold text-neutral-950">{order.order_number}</span>
                  <span className="font-sans text-xs text-neutral-400">
                    Placed: {new Date(order.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                
                {/* Status Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="font-sans text-xs text-neutral-400 font-medium">Status:</span>
                  <div className="relative">
                    {updatingId === order.id && (
                      <Loader2 size={12} className="animate-spin text-gold absolute right-8 top-1/2 -translate-y-1/2" />
                    )}
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-neutral-50 border border-neutral-200 rounded-sm px-3 py-1.5 font-sans text-xs uppercase tracking-wider text-neutral-700 cursor-pointer focus:outline-none focus:border-gold pr-8"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Items & Shipping Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-serif text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14} /> Itemization
                  </h3>
                  <div className="divide-y divide-neutral-100 space-y-3">
                    {order.items?.map((item: any, idx: number) => {
                      const primaryImg = item.product.images?.find((img: any) => img.is_primary)?.image_path || "/images/minimalist.png";
                      return (
                        <div key={idx} className="flex gap-4 items-center pt-2 first:pt-0">
                          <div className="relative w-12 h-14 bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0">
                            <Image src={primaryImg} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-sm text-neutral-900 truncate">{item.product.name}</h4>
                            <p className="font-sans text-[10px] text-neutral-400 uppercase mt-0.5">
                              {item.size ? `Size ${item.size} • ` : ""}Qty {item.quantity}
                            </p>
                          </div>
                          <p className="font-sans text-sm text-neutral-950 font-semibold">MAD {parseFloat(item.price).toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping & Payment coordinates */}
                <div className="bg-neutral-50 p-5 rounded-sm border border-neutral-100 space-y-4 text-xs font-sans">
                  <h3 className="font-serif text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-200/60 pb-2">
                    <MapPin size={14} /> Shipping & Auditing
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-neutral-900">{order.first_name} {order.last_name}</p>
                      <p className="text-neutral-500 mt-1 flex items-center gap-1.5"><Mail size={12} /> {order.email}</p>
                      <p className="text-neutral-500 flex items-center gap-1.5"><Phone size={12} /> {order.phone}</p>
                    </div>
                    <div className="border-t border-neutral-200/50 pt-2 text-neutral-600 leading-normal">
                      <p className="font-medium">Coordinates:</p>
                      <p>{order.street_address}</p>
                      <p>{order.zip_code} {order.city}, Morocco</p>
                    </div>
                    <div className="border-t border-neutral-200/50 pt-2 flex justify-between items-center">
                      <span className="font-medium text-neutral-500">Method:</span>
                      <span className="font-semibold text-neutral-800 uppercase tracking-widest text-[9px] border border-neutral-300 px-2 py-0.5 bg-white rounded-sm">
                        {order.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-neutral-500">Receipt Status:</span>
                      <span className={`font-semibold uppercase tracking-widest text-[9px] border px-2 py-0.5 rounded-sm ${
                        order.payment_status === "paid" 
                          ? "border-emerald-500/30 text-emerald-600 bg-emerald-50"
                          : "border-red-500/20 text-red-500 bg-red-50"
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="border-t border-neutral-200/50 pt-2 flex justify-between items-end">
                      <span className="font-serif text-sm font-semibold text-neutral-700">Total Sum:</span>
                      <span className="font-serif text-base font-bold text-neutral-950">
                        MAD {parseFloat(order.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
