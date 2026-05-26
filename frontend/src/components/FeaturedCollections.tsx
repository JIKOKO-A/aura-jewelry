"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    id: 1,
    title: "Bridal Elegance",
    description: "Timeless pieces for your unforgettable day.",
    image: "/images/bridal.png",
  },
  {
    id: 2,
    title: "The Minimalist",
    description: "Subtle luxury for everyday grace.",
    image: "/images/minimalist.png",
  },
  {
    id: 3,
    title: "Royal Emerald",
    description: "Make a statement with deep, rich tones.",
    image: "/images/emerald.png",
  }
];

export default function FeaturedCollections() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background relative z-10 w-full">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16"
        >
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Curated Collections</h2>
            <p className="text-foreground/70 font-sans max-w-md leading-relaxed">
              Explore our hand-selected ranges designed to elevate your personal style with uncompromising quality and timeless elegance.
            </p>
          </div>
          <Link href="/shop" className="mt-8 md:mt-0 flex items-center gap-2 font-sans uppercase tracking-widest text-sm hover:text-gold transition-colors pb-1 border-b border-transparent hover:border-gold">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-foreground/5 rounded-sm">
                <Image 
                  src={collection.image} 
                  alt={collection.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-gold transition-colors duration-300">{collection.title}</h3>
              <p className="font-sans text-sm text-foreground/60">{collection.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
