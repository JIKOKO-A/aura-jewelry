"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/data";

export default function ProductDetails() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const productData = getProductBySlug(slug);

  const [quantity, setQuantity] = useState(1);
  
  const product = {
    ...productData,
    images: [productData.image, "/images/minimalist.png", "/images/emerald.png"],
    details: ["18k White Gold", "Center Stone: 1.5 Carat", "Clarity: VVS1", "Color: D"],
  };

  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <Link href="/shop" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-12 w-max font-sans text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 flex-shrink-0 border transition-all ${activeImage === img ? 'border-foreground/50' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative w-full aspect-[4/5] bg-foreground/5">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <Image src={activeImage} alt={product.name} fill className="object-cover" />
              </motion.div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{product.name}</h1>
              <p className="font-sans text-xl tracking-widest text-foreground mb-8">{product.price}</p>
              
              <p className="font-sans text-foreground/70 leading-relaxed mb-10 max-w-lg">
                {product.description}
              </p>

              <div className="mb-10">
                <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-4">Product Details</h4>
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="font-sans text-sm text-foreground/80 flex items-center gap-3">
                      <span className="w-1 h-1 bg-gold rounded-full" /> {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center pt-8 border-t border-foreground/10">
                <div className="flex items-center border border-foreground/20 px-4 py-3 h-14 w-32 justify-between">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-foreground/50 hover:text-foreground transition-colors"><Minus size={16} /></button>
                  <span className="font-sans text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-foreground/50 hover:text-foreground transition-colors"><Plus size={16} /></button>
                </div>
                
                <Link href="/checkout" className="flex-1 w-full sm:w-auto h-14 bg-foreground text-background font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors">
                  <ShoppingBag size={16} /> Checkout Now
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
