"use client";

import { motion } from "framer-motion";
import { Package, Heart, Star, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Orders & Tracking");

  const tabs = [
    { name: "Orders & Tracking", icon: Package },
    { name: "Wishlist", icon: Heart },
    { name: "Aura Rewards", icon: Star },
    { name: "Addresses", icon: MapPin },
    { name: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background flex justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-10">
            <h1 className="font-serif text-3xl text-foreground mb-1">Welcome, Sarah</h1>
            <p className="font-sans text-xs uppercase tracking-widest text-gold flex items-center gap-2">
              <Star size={12} fill="currentColor" /> VIP Member
            </p>
          </div>
          
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide transition-colors ${
                  activeTab === tab.name 
                    ? "bg-foreground text-background" 
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <tab.icon size={16} strokeWidth={1.5} />
                {tab.name}
              </button>
            ))}
            <button onClick={() => router.push('/')} className="flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide text-red-500 hover:bg-red-50 transition-colors mt-8">
              <LogOut size={16} strokeWidth={1.5} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <h2 className="font-serif text-2xl text-foreground mb-8">{activeTab}</h2>
          
          {activeTab === "Orders & Tracking" ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-foreground/10 p-6 md:p-8 mb-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 mb-1">Order #AURA-4921</p>
                  <p className="font-sans text-sm text-foreground">Placed on Oct 24, 2026</p>
                </div>
                <div className="bg-gold/10 text-gold px-4 py-1 font-sans text-xs uppercase tracking-widest border border-gold/20">
                  Out for Delivery
                </div>
              </div>

              <div className="flex gap-6 items-center border-t border-b border-foreground/5 py-6 mb-6">
                <div className="relative w-20 h-24 bg-foreground/5 flex-shrink-0">
                  <Image src="/images/bridal.png" alt="Ring" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-foreground">Diamond Halo Ring</h3>
                  <p className="font-sans text-xs text-foreground/60 mb-2">18k White Gold • Size 6</p>
                  <p className="font-sans text-sm">$2,400</p>
                </div>
              </div>

              {/* Tracking Progress */}
              <div className="w-full">
                <div className="flex justify-between font-sans text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                  <span>Confirmed</span>
                  <span>Shipped</span>
                  <span className="text-gold">Out for Delivery</span>
                  <span>Delivered</span>
                </div>
                <div className="w-full h-1 bg-foreground/10 relative">
                  <div className="absolute top-0 left-0 h-full bg-gold w-[75%]" />
                  <div className="absolute top-1/2 left-[75%] -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-gold border-2 border-background rounded-full" />
                </div>
              </div>
              
              <button onClick={() => alert('Tracking details sent to your email!')} className="mt-8 font-sans text-xs uppercase tracking-widest border-b border-foreground pb-1 hover:text-gold hover:border-gold transition-colors flex items-center gap-1">
                Track Package <ChevronRight size={14} />
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 mb-8 border border-dashed border-foreground/20 text-center">
              <p className="font-sans text-foreground/50">{activeTab} section is currently empty.</p>
            </div>
          )}

          {/* Loyalty Banner (Always Visible) */}
          <div className="bg-foreground text-background p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="font-serif text-xl mb-2 flex items-center gap-2">
                <Star size={20} className="text-gold" fill="currentColor" /> 1,240 Aura Points
              </h3>
              <p className="font-sans text-sm text-background/70">You are 260 points away from a $50 reward voucher.</p>
            </div>
            <button onClick={() => alert('Points redeemed! Check your email for the voucher.')} className="px-6 py-3 bg-gold text-foreground font-sans text-xs uppercase tracking-widest hover:bg-gold/90 transition-colors flex-shrink-0">
              Redeem Points
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
