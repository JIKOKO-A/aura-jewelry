"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Checkout() {
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <CheckCircle2 size={80} className="text-gold mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-serif text-4xl text-foreground mb-4">Thank You</h1>
          <p className="font-sans text-foreground/60 max-w-sm mx-auto mb-8">
            Your order #AURA-4921 has been placed successfully. You will receive an email confirmation shortly.
          </p>
          <Link href="/shop" className="border-b border-foreground text-sm uppercase tracking-widest pb-1 hover:text-gold hover:border-gold transition-colors">
            Continue Shopping
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background">
      <div className="max-w-5xl mx-auto">
        <Link href="/shop/diamond-halo-ring" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-12 w-max font-sans text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Product
        </Link>

        <h1 className="font-serif text-4xl text-foreground mb-12">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); setSuccess(true); }}>
              {/* Shipping */}
              <section>
                <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="First Name" required className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                  <input type="text" placeholder="Last Name" required className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                  <input type="email" placeholder="Email Address" required className="md:col-span-2 bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                  <input type="text" placeholder="Address" required className="md:col-span-2 bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                  <input type="text" placeholder="City" required className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                  <input type="text" placeholder="Country" required className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Payment Details</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border border-gold/50 bg-gold/5 px-4 py-3">
                    <input type="radio" id="card" name="payment" defaultChecked className="accent-gold" />
                    <label htmlFor="card" className="font-sans text-sm">Credit Card (Stripe)</label>
                  </div>
                  <div className="flex items-center gap-4 border border-foreground/20 px-4 py-3">
                    <input type="radio" id="cod" name="payment" className="accent-gold" />
                    <label htmlFor="cod" className="font-sans text-sm">Cash on Delivery (Morocco Only)</label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <input type="text" placeholder="Card Number" className="col-span-2 bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                    <input type="text" placeholder="MM/YY" className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                    <input type="text" placeholder="CVC" className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>
                </div>
              </section>

              <button type="submit" className="w-full bg-foreground text-background font-sans text-xs uppercase tracking-widest py-4 hover:bg-foreground/90 transition-colors">
                Complete Order
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="bg-foreground/5 p-6 h-max">
            <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Order Summary</h2>
            <div className="flex gap-4 mb-6">
              <div className="relative w-16 h-20 bg-background flex-shrink-0">
                <Image src="/images/bridal.png" alt="Ring" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-foreground">Diamond Halo Ring</h3>
                <p className="font-sans text-xs text-foreground/60 mb-2">18k White Gold</p>
                <p className="font-sans text-sm">$2,400</p>
              </div>
            </div>
            
            <div className="space-y-4 font-sans text-sm border-t border-foreground/10 pt-6">
              <div className="flex justify-between">
                <span className="text-foreground/60">Subtotal</span>
                <span>$2,400.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="flex justify-between font-bold pt-4 border-t border-foreground/10">
                <span>Total</span>
                <span>$2,400.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
