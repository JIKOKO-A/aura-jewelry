"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    await register(name, email, password);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center pt-32 pb-16 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-foreground/[0.01] border border-foreground/10 p-8 md:p-10 rounded-sm"
      >
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl tracking-widest text-foreground font-semibold inline-block mb-3">
            AURA
          </Link>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-6">Create Client Profile</p>
          <h2 className="font-serif text-2xl text-foreground">Register</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-1.5">
              <User size={12} /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-1.5">
              <Mail size={12} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-1.5">
              <Lock size={12} /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50 flex items-center gap-1.5">
              <Lock size={12} /> Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-foreground text-background font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>Register <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-foreground/5 pt-6 text-center">
          <p className="font-sans text-xs text-foreground/60">
            Already have a Client Profile?{" "}
            <Link href="/login" className="text-gold hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
