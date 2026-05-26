"use client";

import Link from "next/link";
import { Instagram, Play, Compass, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-white/5 pt-24 pb-12 px-6 md:px-12 w-full mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="font-serif text-3xl tracking-widest text-white font-semibold">
              AURA
            </Link>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
              Meticulous Craftsmanship
            </p>
            <p className="font-sans text-sm text-neutral-500 leading-relaxed max-w-xs">
              Handcrafted in Casablanca. Aura embodies timeless luxury, blending high-end jewelry design with the finest raw materials.
            </p>
            {/* Socials */}
            <div className="flex gap-4 pt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M12.289 2C6.617 2 2 6.617 2 12.289c0 4.354 2.707 8.086 6.524 9.555-.102-.816-.19-2.074.041-2.969.208-.888 1.341-5.69 1.341-5.69s-.341-.689-.341-1.704c0-1.597.926-2.79 2.078-2.79.98 0 1.453.736 1.453 1.621 0 .986-.626 2.457-.95 3.822-.269 1.144.577 2.074 1.705 2.074 2.047 0 3.622-2.158 3.622-5.275 0-2.756-1.979-4.685-4.81-4.685-3.277 0-5.198 2.458-5.198 4.994 0 .99.382 2.05.857 2.628.094.113.109.21.081.328-.088.37-.285 1.166-.324 1.325-.052.209-.17.253-.392.149-1.464-.68-2.378-2.822-2.378-4.542 0-3.697 2.686-7.093 7.747-7.093 4.066 0 7.228 2.898 7.228 6.772 0 4.04-2.548 7.292-6.085 7.292-1.189 0-2.307-.618-2.69-1.348l-.734 2.793c-.266 1.024-.985 2.3-1.467 3.086C10.12 21.95 11.187 22 12.29 22 17.962 22 22.56 17.4 22.56 11.73 22.56 6.07 17.962 2 12.289 2z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31.03 2.61.1 3.9.22a5.4 5.4 0 0 0 .1 1.08 5.6 5.6 0 0 1-2.92-2.35 6 6 0 0 1-.09 1.15c.6.43 1.34.7 2.13.78v3.42a9.1 9.1 0 0 0-3.22-1v9.55a5.42 5.42 0 0 1-5.42 5.42 5.42 5.42 0 0 1-5.42-5.42 5.42 5.42 0 0 1 5.42-5.42c.38 0 .75.05 1.1.13v3.52c-.35-.11-.72-.18-1.1-.18a1.9 1.9 0 0 0-1.9 1.9 1.9 1.9 0 0 0 1.9 1.9 1.9 1.9 0 0 0 1.9-1.9V0h3.52z" transform="translate(4.5, 1)"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h3 className="font-serif text-sm uppercase tracking-widest text-white mb-6">Collections</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <Link href="/shop?category=rings" className="hover:text-white transition-colors">Rings</Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="hover:text-white transition-colors">Necklaces</Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="hover:text-white transition-colors">Bracelets</Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="hover:text-white transition-colors">Earrings</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Brand Story */}
          <div>
            <h3 className="font-serif text-sm uppercase tracking-widest text-white mb-6">The House</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1">Our Story <ArrowUpRight size={14} /></Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="hover:text-white transition-colors">Craftsmanship</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Aura Rewards</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Services */}
          <div>
            <h3 className="font-serif text-sm uppercase tracking-widest text-white mb-6">Client Services</h3>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Book an Appointment</Link>
              </li>
              <li>
                <Link href="/about#shipping" className="hover:text-white transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link href="/about#faqs" className="hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <span className="text-neutral-600">Secure Payments via Stripe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-xs text-neutral-600">
            &copy; {currentYear} AURA Jewelry. All rights reserved. Handcrafted luxury items from Morocco.
          </p>
          <div className="flex gap-6 font-sans text-xs text-neutral-600">
            <Link href="/privacy" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
            <Link href="/returns" className="hover:text-neutral-400 transition-colors">Returns & Exchanges</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
