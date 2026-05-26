"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you. Our concierge will contact you within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-3 block">Get in Touch</span>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">Concierge Services</h1>
          <p className="font-sans text-foreground/60 leading-relaxed">
            Whether you require sizing assistance, custom design consultations, or private bookings in our Casablanca atelier, we are delighted to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 bg-foreground/[0.02] border border-foreground/5 p-8 md:p-10 rounded-sm">
            <h2 className="font-serif text-2xl text-foreground mb-8">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email"
                    className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="phone" className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Phone Number (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., +212 600 000 000"
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="message" className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Your Message</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can our concierge assist you?"
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-foreground text-background font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending inquiry..." : "Send Message"} <Send size={14} />
              </button>
            </form>
          </div>

          {/* Right Column: Direct Info */}
          <div className="space-y-12">
            <div>
              <h3 className="font-serif text-xl text-foreground mb-6">Contact Details</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="text-gold p-1">
                    <Phone size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-foreground">Phone & WhatsApp</h4>
                    <p className="font-sans text-sm text-foreground/60 mt-1">+212 661-234567</p>
                    <p className="font-sans text-xs text-neutral-400 mt-0.5">Mon - Sat: 9am - 7pm</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="text-gold p-1">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-foreground">Email Support</h4>
                    <p className="font-sans text-sm text-foreground/60 mt-1">concierge@aura.ma</p>
                    <p className="font-sans text-xs text-neutral-400 mt-0.5">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="text-gold p-1">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm text-foreground">The Atelier</h4>
                    <p className="font-sans text-sm text-foreground/60 mt-1">
                      124 Boulevard d'Anfa, 4th Floor<br />
                      Casablanca 20250, Morocco
                    </p>
                    <p className="font-sans text-xs text-neutral-400 mt-0.5">By appointment only</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-foreground/10 pt-12">
              <h3 className="font-serif text-xl text-foreground mb-4">Direct Concierge</h3>
              <p className="font-sans text-sm text-foreground/60 leading-relaxed mb-6">
                Prefer immediate messaging? Chat directly with an Aura brand representative via WhatsApp.
              </p>
              <a
                href="https://wa.me/212661234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-colors"
              >
                <MessageSquare size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
