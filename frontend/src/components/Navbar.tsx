"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, User, ShieldCheck, LogOut, Heart, LayoutDashboard, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./providers/AuthContext";
import { useCart } from "./providers/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  // Fetch search results on query change
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5)); // Show max 5 matches
        }
      } catch (error) {
        console.error("Search query error:", error);
      }
    }, 300); // Debounce queries

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close user dropdown clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleUserIconClick = () => {
    if (user) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 transition-all duration-500 ${
          isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-foreground/5" : "bg-transparent"
        }`}
      >
        {/* Left Links - Hidden on Mobile */}
        <nav className="hidden md:flex gap-8 items-center text-sm uppercase tracking-widest font-sans text-foreground">
          <Link href="/shop" className="hover:text-gold transition-colors font-medium">Shop</Link>
          <Link href="/about" className="hover:text-gold transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
          {user?.is_admin && (
            <Link href="/admin" className="hover:text-gold transition-colors flex items-center gap-1">
              <ShieldCheck size={14} className="text-gold" /> Admin Portal
            </Link>
          )}
        </nav>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="font-serif text-2xl md:text-3xl tracking-widest text-foreground font-semibold">
            AURA
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex gap-4 md:gap-6 items-center text-foreground z-10">
          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-gold transition-colors p-1"
            title="Search Products"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* Account Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={handleUserIconClick}
              className="hover:text-gold transition-colors p-1 flex items-center"
              title={user ? `Logged in as ${user.name}` : "Log In / Register"}
            >
              <User size={20} strokeWidth={1.5} />
              {user && <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-background" />}
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isUserDropdownOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-56 bg-background border border-foreground/10 py-3 shadow-xl rounded-sm z-50 text-foreground"
                >
                  <div className="px-4 py-2 border-b border-foreground/5 mb-2">
                    <p className="font-serif text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="font-sans text-[10px] text-foreground/50 truncate mt-0.5">{user.email}</p>
                  </div>
                  {user.is_admin ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider hover:bg-foreground/5 transition-colors font-medium text-gold"
                    >
                      <ShieldCheck size={14} /> Admin Portal
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider hover:bg-foreground/5 transition-colors"
                    >
                      <LayoutDashboard size={14} /> My Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider hover:bg-red-50 text-red-500 transition-colors text-left font-medium mt-2 border-t border-foreground/5 pt-2"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon / Drawer Trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="hover:text-gold transition-colors relative p-1"
            title="Shopping Bag"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-foreground font-sans font-bold text-[9px] h-4 w-4 rounded-full flex items-center justify-center border border-background">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden hover:text-gold transition-colors p-1"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-background border-r border-foreground/10 z-50 flex flex-col p-6 shadow-xl md:hidden text-foreground"
            >
              <div className="flex justify-between items-center mb-12">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-2xl tracking-widest font-semibold">
                  AURA
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-foreground/5 rounded-full">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-col gap-6 text-sm uppercase tracking-[0.2em] font-sans">
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold transition-colors pb-1 border-b border-foreground/5">Shop</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold transition-colors pb-1 border-b border-foreground/5">About</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold transition-colors pb-1 border-b border-foreground/5">Contact</Link>
                {user ? (
                  <>
                    <Link href={user.is_admin ? "/admin" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold transition-colors pb-1 border-b border-foreground/5 flex items-center justify-between">
                      <span>Dashboard</span> <ChevronRight size={14} />
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-left text-red-500 hover:text-red-600 transition-colors uppercase tracking-[0.2em] flex items-center justify-between"
                    >
                      <span>Sign Out</span> <LogOut size={14} />
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-gold transition-colors pb-1 border-b border-foreground/5 flex items-center justify-between font-semibold text-gold">
                    <span>Sign In</span> <ChevronRight size={14} />
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col justify-start pt-32 px-6 md:px-12 text-foreground"
          >
            {/* Close Search */}
            <div className="absolute top-6 right-6 md:top-10 md:right-12">
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-foreground/60 hover:text-foreground p-2 transition-colors hover:bg-foreground/5 rounded-full"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="max-w-3xl w-full mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative border-b border-foreground/20 pb-4 mb-10">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our catalog (e.g. Ring, Emerald, Gold)..."
                  className="w-full bg-transparent text-2xl md:text-4xl font-serif tracking-wide focus:outline-none placeholder:text-foreground/30 pr-10"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-gold transition-colors">
                  <Search size={24} strokeWidth={1.5} />
                </button>
              </form>

              {/* Instant Search Results */}
              <div className="space-y-4">
                {searchResults.length > 0 ? (
                  <>
                    <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-4">Suggested Pieces</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {searchResults.map((prod) => {
                        const primaryImg = prod.images?.find((i: any) => i.is_primary)?.image_path || prod.image || "/images/minimalist.png";
                        return (
                          <Link 
                            key={prod.id}
                            href={`/shop/${prod.slug}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-4 p-2 hover:bg-foreground/5 transition-all group"
                          >
                            <div className="relative w-12 h-14 bg-foreground/5 border border-foreground/5 overflow-hidden flex-shrink-0">
                              <Image src={primaryImg} alt={prod.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-serif text-base text-foreground group-hover:text-gold transition-colors truncate">{prod.name}</h5>
                              <p className="font-sans text-xs text-foreground/50">{prod.category?.name || prod.category}</p>
                            </div>
                            <p className="font-sans text-sm tracking-wider text-foreground">MAD {parseFloat(prod.price).toLocaleString()}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : searchQuery ? (
                  <p className="font-sans text-sm text-foreground/50 text-center py-10">No items match your search. Press Enter to view all.</p>
                ) : (
                  <div className="py-6 text-center text-foreground/45 font-sans text-xs uppercase tracking-widest">
                    Type a query to search Aura
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
