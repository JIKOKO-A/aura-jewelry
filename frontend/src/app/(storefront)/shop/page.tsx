"use client";

import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { products } from "@/lib/data";

export default function Shop() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-foreground/10 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">All Collections</h1>
            <p className="font-sans text-foreground/60 max-w-md leading-relaxed">
              Discover our full range of handcrafted luxury jewelry, meticulously designed for the modern connoisseur.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 md:mt-0 flex gap-6"
          >
            <button onClick={() => alert('Filter system coming in Phase 6!')} className="font-sans text-sm uppercase tracking-widest pb-1 border-b border-foreground hover:text-gold hover:border-gold transition-colors">
              Filter
            </button>
            <button onClick={() => alert('Sorting coming in Phase 6!')} className="font-sans text-sm uppercase tracking-widest pb-1 border-b border-foreground hover:text-gold hover:border-gold transition-colors">
              Sort By
            </button>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
        
        {/* Load More */}
        <div className="mt-20 flex justify-center">
          <button onClick={() => alert('You have reached the end of the catalog.')} className="px-10 py-4 border border-foreground text-foreground font-sans tracking-widest text-sm uppercase transition-all hover:bg-foreground hover:text-background">
            Load More Pieces
          </button>
        </div>
      </div>
    </main>
  );
}
