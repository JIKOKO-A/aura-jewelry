"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { useCart, CartProduct } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Heart, Star, MapPin, Settings, LogOut, ChevronRight, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CustomerDashboard() {
  const { user, token, logout, isLoading: authLoading, refreshUser } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist, refreshWishlist } = useWishlist();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Orders & Tracking");
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [voucher, setVoucher] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Address form fields
  const [addressLine, setAddressLine] = useState("124 Boulevard d'Anfa, 4th Floor");
  const [city, setCity] = useState("Casablanca");
  const [zip, setZip] = useState("20250");
  const [phone, setPhone] = useState("+212 661-234567");

  // Auth Protection Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch orders when tab changes to orders
  useEffect(() => {
    async function fetchOrders() {
      if (!token) return;
      setOrdersLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders`, {
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
        console.error("Error loading orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    }

    if (token && activeTab === "Orders & Tracking") {
      fetchOrders();
    }
  }, [activeTab, token]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  const tabs = [
    { name: "Orders & Tracking", icon: Package },
    { name: "Wishlist", icon: Heart },
    { name: "Aura Rewards", icon: Star },
    { name: "Addresses", icon: MapPin },
    { name: "Settings", icon: Settings },
  ];

  // Helper to calculate progress percentage based on order status
  const getStatusProgress = (status: string) => {
    switch (status) {
      case "Pending":
        return 15;
      case "Processing":
        return 35;
      case "Shipped":
        return 60;
      case "Out for Delivery":
        return 85;
      case "Delivered":
        return 100;
      default:
        return 10;
    }
  };

  const handleRedeemPoints = async () => {
    if (user.aura_points < 1000) {
      toast.error("You need at least 1,000 Aura Points to redeem a voucher.");
      return;
    }

    setRedeemLoading(true);
    try {
      const res = await fetch(`${API_URL}/me/redeem-points`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Voucher successfully generated!");
        setVoucher(data.message);
        await refreshUser();
      } else {
        toast.error(data.message || "Failed to redeem points.");
      }
    } catch (error) {
      console.error("Error redeeming points:", error);
      toast.error("Server connection failed.");
    } finally {
      setRedeemLoading(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Shipping coordinates updated successfully.");
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background flex justify-center text-foreground">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-10">
            <h1 className="font-serif text-3xl text-foreground mb-1 leading-tight">{user.name}</h1>
            <p className="font-sans text-xs uppercase tracking-widest text-gold flex items-center gap-1.5 mt-2">
              <Star size={12} fill="currentColor" /> {user.is_admin ? "Atelier Director" : user.aura_points >= 2000 ? "VIP Member" : "Aura Client"}
            </p>
          </div>
          
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide transition-colors rounded-sm ${
                  activeTab === tab.name 
                    ? "bg-foreground text-background font-medium" 
                    : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <tab.icon size={16} strokeWidth={1.5} />
                {tab.name}
              </button>
            ))}
            <button 
              onClick={logout} 
              className="flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide text-red-500 hover:bg-red-500/5 transition-colors mt-8 rounded-sm"
            >
              <LogOut size={16} strokeWidth={1.5} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-2xl text-foreground mb-8 border-b border-foreground/5 pb-4">{activeTab}</h2>
          
          <AnimatePresence mode="wait">
            {activeTab === "Orders & Tracking" && (
              <motion.div 
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {ordersLoading ? (
                  <div className="py-20 flex justify-center"><Loader2 size={24} className="animate-spin text-gold" /></div>
                ) : orders.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-foreground/15 text-center">
                    <p className="font-sans text-foreground/50 mb-6">You haven't placed any orders yet.</p>
                    <Link href="/shop" className="px-6 py-2.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                      Discover Our Pieces
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div 
                      key={order.id}
                      className="border border-foreground/10 p-6 md:p-8 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
                      
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-foreground/5 pb-4">
                        <div>
                          <p className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 mb-1">Order #{order.order_number}</p>
                          <p className="font-sans text-xs text-foreground/60">Placed on {new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                        <div className="bg-gold/5 text-gold px-4 py-1.5 font-sans text-[10px] uppercase tracking-widest border border-gold/15 rounded-sm">
                          {order.status}
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="space-y-4 mb-6">
                        {order.items?.map((item: any, i: number) => {
                          const primaryImg = item.product.images?.find((img: any) => img.is_primary)?.image_path || "/images/minimalist.png";
                          return (
                            <div key={i} className="flex gap-4 items-center">
                              <div className="relative w-12 h-14 bg-foreground/5 border border-foreground/5 overflow-hidden flex-shrink-0">
                                <Image src={primaryImg} alt={item.product.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-sm text-foreground truncate">{item.product.name}</h4>
                                <p className="font-sans text-[10px] text-foreground/50 uppercase mt-0.5">
                                  {item.size ? `Size ${item.size} • ` : ""}Qty {item.quantity}
                                </p>
                              </div>
                              <p className="font-sans text-xs font-semibold text-foreground">MAD {parseFloat(item.price).toLocaleString()}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Progress Line */}
                      <div className="w-full pt-4 border-t border-foreground/5">
                        <div className="flex justify-between font-sans text-[9px] uppercase tracking-widest text-foreground/50 mb-3">
                          <span className={order.status === "Pending" ? "text-gold font-bold" : ""}>Pending</span>
                          <span className={order.status === "Processing" ? "text-gold font-bold" : ""}>Processing</span>
                          <span className={order.status === "Shipped" ? "text-gold font-bold" : ""}>Shipped</span>
                          <span className={order.status === "Out for Delivery" ? "text-gold font-bold" : ""}>Out for Delivery</span>
                          <span className={order.status === "Delivered" ? "text-emerald-500 font-bold" : ""}>Delivered</span>
                        </div>
                        <div className="w-full h-1 bg-foreground/10 relative">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gold transition-all duration-1000" 
                            style={{ width: `${getStatusProgress(order.status)}%` }}
                          />
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-gold border-2 border-background rounded-full transition-all duration-1000"
                            style={{ left: `${getStatusProgress(order.status)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center text-xs">
                        <button 
                          onClick={() => toast.info(`A tracking representative will contact you shortly regarding order ${order.order_number}`)} 
                          className="font-sans uppercase tracking-widest border-b border-foreground pb-0.5 hover:text-gold hover:border-gold transition-colors flex items-center gap-1"
                        >
                          Track Package <ChevronRight size={12} />
                        </button>
                        <span className="font-sans text-foreground/60">
                          Total: <strong className="font-semibold text-foreground">MAD {parseFloat(order.total).toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "Wishlist" && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {wishlistItems.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-foreground/15 text-center">
                    <p className="font-sans text-foreground/50 mb-6">Your wishlist is currently empty.</p>
                    <Link href="/shop" className="px-6 py-2.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                      Explore Shop
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.product.id} className="border border-foreground/10 p-4 rounded-sm flex flex-col justify-between group relative bg-foreground/[0.01]">
                        {/* Image wrapper */}
                        <div className="relative aspect-[4/5] bg-foreground/5 overflow-hidden rounded-sm mb-4">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-102" />
                          
                          {/* Trash button */}
                          <button
                            onClick={() => toggleWishlist(item.product)}
                            className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-red-500 backdrop-blur-sm rounded-full text-foreground/60 hover:text-white transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        
                        <div>
                          <p className="font-sans text-[9px] uppercase tracking-widest text-foreground/45 mb-1">{typeof item.product.category === 'object' ? (item.product.category as any).name : item.product.category}</p>
                          <h4 className="font-serif text-base text-foreground font-medium mb-1 truncate">{item.product.name}</h4>
                          <p className="font-sans text-sm text-foreground font-bold mb-4">MAD {item.product.price.toLocaleString()}</p>
                        </div>
                        
                        <button
                          onClick={() => addToCart(item.product, 1, null)}
                          className="w-full py-2.5 bg-foreground text-background font-sans text-[10px] uppercase tracking-widest hover:bg-foreground/95 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={12} /> Add to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "Aura Rewards" && (
              <motion.div 
                key="rewards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Points overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-foreground text-background p-8 rounded-sm">
                    <span className="font-sans text-xs uppercase tracking-widest text-background/65 mb-2 block">Loyalty Points Balance</span>
                    <h3 className="font-serif text-4xl mb-4 flex items-center gap-2.5">
                      <Star size={30} className="text-gold" fill="currentColor" /> {user.aura_points} Points
                    </h3>
                    <p className="font-sans text-xs text-background/70 leading-relaxed">
                      Collect 1 point for every 10 MAD spent. Points can be redeemed for private discount vouchers (1,000 points = 100 MAD voucher).
                    </p>
                  </div>
                  
                  <div className="border border-foreground/10 p-8 rounded-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg mb-2">Redeem Milestone</h4>
                      <p className="font-sans text-xs text-foreground/60 leading-normal mb-4">
                        {user.aura_points >= 1000 
                          ? "You have accumulated enough points for a MAD 100 reward voucher!"
                          : `You need ${1000 - user.aura_points} more points to unlock your next MAD 100 voucher.`
                        }
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleRedeemPoints}
                      disabled={user.aura_points < 1000 || redeemLoading}
                      className="w-full py-3.5 bg-gold text-foreground font-sans text-xs uppercase tracking-widest font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {redeemLoading ? <Loader2 size={14} className="animate-spin" /> : "Redeem 1,000 Points"}
                    </button>
                  </div>
                </div>

                {/* Voucher display */}
                {voucher && (
                  <div className="border border-emerald-500/25 bg-emerald-500/5 p-6 rounded-sm text-center">
                    <p className="font-sans text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Voucher Redeemed ✓</p>
                    <p className="font-serif text-base text-foreground mb-4">{voucher}</p>
                    <p className="font-sans text-[11px] text-neutral-400">Copy this code and paste it in your next checkout inquiry to apply the discount.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "Addresses" && (
              <motion.div 
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <form onSubmit={handleSaveAddress} className="space-y-6 max-w-xl bg-foreground/[0.01] border border-foreground/10 p-8 rounded-sm">
                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">City</label>
                      <input 
                        type="text" 
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Zip Code</label>
                      <input 
                        type="text" 
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors rounded-sm"
                  >
                    Save Address
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "Settings" && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 max-w-xl bg-foreground/[0.01] border border-foreground/10 p-8 rounded-sm"
              >
                <div className="flex flex-col space-y-1">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Client ID</span>
                  <span className="font-sans text-sm text-foreground/80 font-medium">AURA-C-{user.id}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Profile Name</span>
                  <span className="font-serif text-lg text-foreground font-medium">{user.name}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Email Coordinates</span>
                  <span className="font-sans text-sm text-foreground/80 font-medium">{user.email}</span>
                </div>
                <div className="border-t border-foreground/10 pt-6">
                  <h4 className="font-serif text-base mb-4">Security Credentials</h4>
                  <button 
                    onClick={() => toast.info("Password resetting link has been dispatched to your email coordinates.")} 
                    className="px-6 py-2.5 border border-foreground/20 text-foreground font-sans text-xs uppercase tracking-widest hover:border-foreground transition-colors rounded-sm"
                  >
                    Change Account Password
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
