"use client";

import { LayoutDashboard, ShoppingCart, Users, PackageSearch, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: PackageSearch },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-background border-r border-foreground/10 flex flex-col h-screen sticky top-0">
        <div className="p-8 border-b border-foreground/10">
          <Link href="/" className="font-serif text-2xl tracking-widest text-foreground font-semibold">AURA</Link>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-1 px-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link 
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans rounded-sm transition-colors ${
                  isActive 
                    ? "bg-foreground text-background" 
                    : "text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                <tab.icon size={16} /> {tab.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-foreground/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-foreground/70 hover:bg-foreground/5 rounded-sm">
            <Settings size={16} /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
