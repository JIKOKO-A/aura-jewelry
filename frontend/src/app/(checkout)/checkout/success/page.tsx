"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Truck, Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("order_number") || "AURA-MOCK";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  const savedToken = typeof window !== "undefined" ? localStorage.getItem("aura_auth_token") : null;

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!savedToken || orderNumber === "AURA-MOCK") {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/orders/${orderNumber}`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            Accept: "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Error fetching success order details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [orderNumber, savedToken]);

  // Delivery calculation (e.g. 3-4 days from now)
  const getDeliveryDateRange = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 4);
    
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${minDate.toLocaleDateString("en-US", options)} - ${maxDate.toLocaleDateString("en-US", options)}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-20 text-foreground">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Animated Check Icon */}
        <CheckCircle2 size={80} className="text-gold mx-auto mb-6" strokeWidth={1} />
        
        <span className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-2 block">Thank You</span>
        <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-4">Order Confirmed</h1>
        
        <p className="font-sans text-sm text-foreground/60 max-w-md mx-auto mb-10 leading-relaxed">
          Your order <span className="font-semibold text-foreground font-sans">#{orderNumber}</span> has been placed successfully. A receipt and shipping confirmation have been sent to your email.
        </p>

        {/* Shipping details block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-foreground/[0.01] border border-foreground/10 p-6 md:p-8 rounded-sm mb-10 text-left">
          <div className="flex gap-3.5 items-start">
            <div className="text-gold p-1 bg-gold/5 rounded-full">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="font-serif text-sm text-foreground">Estimated Delivery</h4>
              <p className="font-sans text-sm text-foreground/75 mt-1 font-medium">{getDeliveryDateRange()}</p>
              <p className="font-sans text-[10px] text-neutral-400 mt-0.5 uppercase tracking-widest">Complimentary Express</p>
            </div>
          </div>
          <div className="flex gap-3.5 items-start">
            <div className="text-gold p-1 bg-gold/5 rounded-full">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="font-serif text-sm text-foreground">Delivery Method</h4>
              <p className="font-sans text-sm text-foreground/75 mt-1 font-medium">Aura Luxury Logistics</p>
              <p className="font-sans text-[10px] text-neutral-400 mt-0.5 uppercase tracking-widest">Fully Insured Hand-Delivery</p>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        {order && (
          <div className="bg-foreground/[0.01] border border-foreground/10 p-6 md:p-8 rounded-sm text-left mb-10">
            <h3 className="font-serif text-lg mb-6 border-b border-foreground/5 pb-2">Order Summary</h3>
            <div className="divide-y divide-foreground/5 space-y-4">
              {order.items?.map((item: any, i: number) => {
                const primaryImage = item.product.images?.find((img: any) => img.is_primary)?.image_path || "/images/minimalist.png";
                return (
                  <div key={i} className="flex gap-4 items-center py-2">
                    <div className="relative w-12 h-14 bg-foreground/5 border border-foreground/5 overflow-hidden flex-shrink-0">
                      <Image src={primaryImage} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-serif text-sm text-foreground truncate">{item.product.name}</h4>
                      <p className="font-sans text-[10px] text-foreground/50 uppercase mt-0.5">
                        {item.size ? `Size ${item.size} • ` : ""}Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-sans text-sm text-foreground font-semibold">MAD {parseFloat(item.price).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-foreground/10 pt-4 mt-6 flex justify-between items-center">
              <span className="font-sans text-xs uppercase tracking-widest text-foreground/60">Total Paid</span>
              <span className="font-serif text-lg font-semibold text-foreground">
                MAD {parseFloat(order.total).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="px-8 py-3.5 border border-foreground text-foreground font-sans text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors rounded-sm flex items-center justify-center gap-2"
          >
            Track in Dashboard
          </Link>
          <Link 
            href="/shop" 
            className="px-8 py-3.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors rounded-sm flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
