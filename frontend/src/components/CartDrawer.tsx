"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./providers/CartContext";

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    cartCount 
  } = useCart();
  
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking the overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setIsCartOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer Container */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-background border-l border-foreground/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="px-6 py-6 border-b border-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-gold" />
                <h2 className="font-serif text-lg tracking-wider text-foreground">Shopping Bag ({cartCount})</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-foreground/60 hover:text-foreground p-1 transition-colors hover:bg-foreground/5 rounded-full"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Drawer Body - Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
              {cartItems.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                    <ShoppingBag size={24} strokeWidth={1} className="text-foreground/40" />
                  </div>
                  <h3 className="font-serif text-xl mb-2">Your Bag is Empty</h3>
                  <p className="font-sans text-sm text-foreground/55 max-w-xs mb-8 leading-relaxed">
                    Discover Aura's signature luxury pieces, hand-selected to elevate your personal collection.
                  </p>
                  <Link 
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="px-8 py-3.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors inline-flex items-center gap-2 rounded-sm"
                  >
                    Start Exploring <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                /* Items List */
                cartItems.map((item, i) => (
                  <div key={`${item.product.id}-${item.size}-${i}`} className="flex gap-4 items-start border-b border-foreground/5 pb-6">
                    {/* Item Image */}
                    <div className="relative w-20 h-24 bg-foreground/5 flex-shrink-0 border border-foreground/5 overflow-hidden">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-[10px] text-gold uppercase tracking-widest mb-1">
                        {typeof item.product.category === 'object' ? item.product.category.name : item.product.category}
                      </p>
                      <h4 className="font-serif text-base text-foreground truncate mb-1">
                        <Link href={`/shop/${item.product.slug}`} onClick={() => setIsCartOpen(false)} className="hover:text-gold transition-colors">
                          {item.product.name}
                        </Link>
                      </h4>
                      {item.size && (
                        <p className="font-sans text-xs text-foreground/60 mb-3">Ring Size: <span className="text-foreground font-medium">{item.size}</span></p>
                      )}
                      
                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-foreground/15 px-2 py-1 h-9 justify-between w-24">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.size, Math.max(1, item.quantity - 1))}
                            className="text-foreground/55 hover:text-foreground p-0.5 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-sans text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="text-foreground/55 hover:text-foreground p-0.5 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-foreground/40 hover:text-red-500 p-2 transition-colors hover:bg-red-50 rounded-full"
                          title="Remove item"
                        >
                          <Trash2 size={15} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                    {/* Item Price */}
                    <div className="text-right">
                      <p className="font-sans text-sm tracking-wider text-foreground">
                        MAD {numberWithCommas(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="font-sans text-[10px] text-foreground/50 mt-1">
                          MAD {numberWithCommas(item.product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="px-6 py-6 border-t border-foreground/5 bg-foreground/[0.01]">
                <div className="flex justify-between items-end mb-4">
                  <span className="font-sans text-xs uppercase tracking-widest text-foreground/60">Estimated Subtotal</span>
                  <span className="font-serif text-xl font-medium text-foreground">
                    MAD {numberWithCommas(cartSubtotal)}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-foreground/50 leading-normal mb-6">
                  Complimentary luxury packaging and fully insured shipping throughout Morocco. VAT included.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full h-12 bg-foreground text-background font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors rounded-sm"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center py-2 text-xs font-sans uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/20"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Utility helper to format numbers
function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
