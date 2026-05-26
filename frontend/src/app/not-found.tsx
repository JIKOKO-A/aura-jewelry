"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-8 mx-auto text-gold">
          <Compass size={28} strokeWidth={1} />
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4 font-semibold tracking-wider">404</h1>
        <h2 className="font-serif text-2xl text-foreground mb-4">Collection Not Found</h2>
        <p className="font-sans text-sm text-foreground/55 mb-10 leading-relaxed">
          The jewelry piece, collection, or portal you are seeking does not exist or has been moved to our archives.
        </p>
        <Link 
          href="/shop" 
          className="px-8 py-3.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors inline-block rounded-sm"
        >
          Return to Catalog
        </Link>
      </motion.div>
    </main>
  );
}
