"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, ShoppingBag, Menu, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 transition-colors duration-500 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Left Links - Hidden on Mobile */}
      <nav className="hidden md:flex gap-8 items-center text-sm uppercase tracking-widest font-sans text-foreground">
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <Link href="/shop" className="hover:text-gold transition-colors">Collections</Link>
        <Link href="/" className="hover:text-gold transition-colors">Our Story</Link>
      </nav>

      {/* Center Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link href="/" className="font-serif text-3xl tracking-widest text-foreground font-semibold">
          AURA
        </Link>
      </div>

      {/* Right Icons */}
      <div className="flex gap-4 md:gap-6 items-center text-foreground">
        <button className="hover:text-gold transition-colors">
          <Search size={20} strokeWidth={1.5} />
        </button>
        <Link href="/dashboard" className="hidden md:block hover:text-gold transition-colors">
          <User size={20} strokeWidth={1.5} />
        </Link>
        <Link href="/checkout" className="hover:text-gold transition-colors relative">
          <ShoppingBag size={20} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] h-4 w-4 rounded-full flex items-center justify-center">0</span>
        </Link>
        <button className="md:hidden hover:text-gold transition-colors">
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </div>
    </motion.header>
  );
}
