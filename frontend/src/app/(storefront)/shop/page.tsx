"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Loader2, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

// Wrap in Suspense to safely use useSearchParams in Next.js SPA
export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background text-foreground">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read filter params from URL
  const selectedCategory = searchParams.get("category") || "all";
  const selectedSort = searchParams.get("sort") || "newest";
  const searchQuery = searchParams.get("search") || "";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const categories = [
    { label: "All Collections", value: "all" },
    { label: "Rings", value: "rings" },
    { label: "Necklaces", value: "necklaces" },
    { label: "Bracelets", value: "bracelets" },
    { label: "Earrings", value: "earrings" },
  ];

  const sortOptions = [
    { label: "Newest Pieces", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_URL}/products?`;
        
        if (selectedCategory && selectedCategory !== "all") {
          url += `category=${encodeURIComponent(selectedCategory)}&`;
        }
        if (selectedSort) {
          url += `sort=${encodeURIComponent(selectedSort)}&`;
        }
        if (searchQuery) {
          url += `search=${encodeURIComponent(searchQuery)}&`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setError("Failed to load products from server.");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to connect to the backend server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, selectedSort, searchQuery]);

  const updateURLParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 border-b border-foreground/10 pb-8 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">
              {searchQuery ? `Search Results` : categories.find(c => c.value === selectedCategory)?.label || "All Collections"}
            </h1>
            <p className="font-sans text-foreground/60 max-w-md leading-relaxed text-sm">
              {searchQuery 
                ? `Showing results matching "${searchQuery}"`
                : "Discover our full range of handcrafted luxury jewelry, meticulously designed for the modern connoisseur."
              }
            </p>
          </motion.div>

          {/* Filtering and Sorting Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-auto flex flex-wrap gap-4 items-center justify-between lg:justify-end"
          >
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => updateURLParams("category", cat.value)}
                  className={`px-4 py-2 font-sans text-xs uppercase tracking-widest transition-all rounded-sm border ${
                    selectedCategory === cat.value
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground/75 border-foreground/15 hover:border-foreground/50"
                  }`}
                >
                  {cat.label === "All Collections" ? "All" : cat.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 border border-foreground/15 px-3 py-2 rounded-sm bg-transparent">
              <ArrowUpDown size={14} className="text-foreground/50" />
              <select
                value={selectedSort}
                onChange={(e) => updateURLParams("sort", e.target.value)}
                className="bg-transparent font-sans text-xs uppercase tracking-widest text-foreground/80 focus:outline-none cursor-pointer pr-4"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-background text-foreground">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>

        {/* Error State */}
        {error && (
          <div className="py-20 text-center border border-dashed border-red-200/30 bg-red-500/5 text-red-500 rounded-sm">
            <p className="font-serif text-lg mb-2">Service Temporarily Unavailable</p>
            <p className="font-sans text-sm opacity-80">{error}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-foreground/10 rounded-sm w-full" />
                <div className="flex justify-between items-center px-1">
                  <div className="space-y-2 w-1/2">
                    <div className="h-2 bg-foreground/10 rounded w-1/3" />
                    <div className="h-4 bg-foreground/10 rounded w-full" />
                  </div>
                  <div className="h-4 bg-foreground/10 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Product Grid */
          <>
            {products.length === 0 ? (
              <div className="py-32 text-center border border-dashed border-foreground/10 rounded-sm flex flex-col items-center justify-center">
                <p className="font-serif text-2xl text-foreground/60 mb-2">No Pieces Found</p>
                <p className="font-sans text-sm text-foreground/45 max-w-sm mb-6 leading-relaxed">
                  We currently do not have any active collection items matching the selected parameters.
                </p>
                {(selectedCategory !== "all" || searchQuery) && (
                  <button 
                    onClick={() => router.push("/shop")}
                    className="px-6 py-2.5 border border-foreground text-foreground font-sans text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
