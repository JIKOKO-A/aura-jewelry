"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const faqs = [
    {
      q: "Where are Aura pieces manufactured?",
      a: "Every Aura creation is meticulously designed and handcrafted in our private atelier in Casablanca, Morocco, by master artisans with decades of experience in high jewelry fabrication."
    },
    {
      q: "What materials do you use?",
      a: "We work exclusively with ethical 18k solid gold (yellow, white, and rose), platinum, and hand-selected VVS1 clarity, D-color conflict-free diamonds and grade-A colored gemstones."
    },
    {
      q: "Is shipping insured?",
      a: "Yes, all orders shipped within Morocco are fully insured, tracked, and delivered securely to your doorstep via our premium logistics partner free of charge."
    },
    {
      q: "Can I customize a ring or order custom sizing?",
      a: "Absolutely. We specialize in custom ring fabrications and sizing adjustments. Please contact our concierge or book an in-person consultation at our Casablanca office."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section 1: Hero Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-3 block">The House of Aura</span>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-8 leading-[1.1]">
              Redefining Modern Luxury
            </h1>
            <p className="font-sans text-foreground/75 leading-relaxed mb-6">
              Founded on the pillars of purity, geometric elegance, and uncompromising quality, Aura makes fine jewelry that is meant to be lived in. We believe that luxury should not be locked in a vault, but experienced daily as a personal signature.
            </p>
            <p className="font-sans text-foreground/75 leading-relaxed mb-10">
              Each piece in our collection is an exploration of form, symmetry, and the natural brilliance of raw earth elements. Made for the modern connoisseur, our designs combine timeless beauty with contemporary clean lines.
            </p>
            <Link href="/shop" className="px-8 py-3.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors inline-block rounded-sm">
              Discover the Catalog
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-[4/5] bg-foreground/5 overflow-hidden rounded-sm"
          >
            <Image 
              src="/images/bridal.png" 
              alt="Diamond Ring Crafting" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/5" />
          </motion.div>
        </div>

        {/* Section 2: Craftsmanship */}
        <div id="craftsmanship" className="border-t border-foreground/10 pt-32 mb-32">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-3 block">The Atelier</span>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">Meticulously Handcrafted</h2>
            <p className="font-sans text-foreground/60 leading-relaxed">
              From raw gold alloy formulation to final micro-pavé gemstone settings, everything takes place under one roof in Casablanca.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-4">
              <div className="relative aspect-[3/2] bg-foreground/5 overflow-hidden rounded-sm mb-4">
                <Image src="/images/minimalist.png" alt="Metal casting" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-xl text-foreground">1. Design & Alloys</h3>
              <p className="font-sans text-sm text-foreground/75 leading-relaxed">
                We formulate our own signature gold alloys, ensuring that our white gold has a bright platinum lustre, and our rose gold offers a warm, subtle copper blush.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="relative aspect-[3/2] bg-foreground/5 overflow-hidden rounded-sm mb-4">
                <Image src="/images/emerald.png" alt="Gemstone selection" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-xl text-foreground">2. Gemstone Curation</h3>
              <p className="font-sans text-sm text-foreground/75 leading-relaxed">
                Only one out of every thousand gemstones meets our stringent requirements for color intensity, tone depth, and inclusions structure.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="relative aspect-[3/2] bg-foreground/5 overflow-hidden rounded-sm mb-4">
                <Image src="/images/bridal.png" alt="Setting diamonds" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-xl text-foreground">3. Hand Setting</h3>
              <p className="font-sans text-sm text-foreground/75 leading-relaxed">
                Stones are microscopically positioned and secured by hand under advanced optics, offering maximum light return and unmatched durability.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: FAQs */}
        <div id="faqs" className="border-t border-foreground/10 pt-32">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-16 text-center">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-foreground/10 pb-8">
                  <h4 className="font-serif text-lg text-foreground mb-3">{faq.q}</h4>
                  <p className="font-sans text-sm text-foreground/60 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
