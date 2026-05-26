import Link from "next/link";
import { Lock } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Secure Checkout Header */}
      <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl tracking-widest text-foreground font-semibold">
            AURA
          </Link>
          <div className="flex items-center gap-2 text-foreground/50 font-sans text-xs uppercase tracking-widest">
            <Lock size={14} /> Secure Checkout
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
