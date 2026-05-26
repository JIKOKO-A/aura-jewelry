"use client";

import { useEffect } from "react";
import { LayoutDashboard, ShoppingCart, Users, PackageSearch, BarChart3, Settings, LogOut, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Enforce Admin guard
  useEffect(() => {
    if (!isLoading && (!user || !user.is_admin)) {
      toast.error("Access denied. Administrator privileges required.");
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: PackageSearch },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex text-neutral-800">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 flex-shrink-0 shadow-sm z-30">
        <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
          <div>
            <Link href="/" className="font-serif text-2xl tracking-widest text-neutral-900 font-semibold">AURA</Link>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gold mt-1">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-1 px-4 overflow-y-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link 
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans rounded-sm transition-colors ${
                  isActive 
                    ? "bg-neutral-900 text-white font-medium" 
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <tab.icon size={16} /> {tab.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100 space-y-2 bg-neutral-50/50">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-neutral-600 hover:bg-neutral-100 rounded-sm transition-colors"
          >
            <ArrowLeft size={16} /> View Storefront
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-red-500 hover:bg-red-50 rounded-sm transition-colors text-left"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {children}
      </div>
    </div>
  );
}
