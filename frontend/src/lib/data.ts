// This file serves as the centralized data layer for the frontend prototype.
// In a full production environment, these exports would be replaced by API calls (e.g., fetch('/api/products')).

export const products = [
  { id: 1, slug: "diamond-halo-ring", name: "Diamond Halo Ring", price: "$2,400", category: "Rings", image: "/images/bridal.png", description: "A breathtaking center diamond framed by a brilliant halo of pavé-set stones. Expertly crafted in platinum for a lifetime of radiant elegance. This signature piece captures the essence of luxury." },
  { id: 2, slug: "minimalist-gold-cuff", name: "Minimalist Gold Cuff", price: "$850", category: "Bracelets", image: "/images/minimalist.png", description: "Sleek and modern. This 18k solid gold cuff is designed to be worn every day, offering a subtle yet striking statement." },
  { id: 3, slug: "emerald-drop-pendant", name: "Emerald Drop Pendant", price: "$3,200", category: "Necklaces", image: "/images/emerald.png", description: "A rich, vibrant emerald suspended on an 18k yellow gold chain. Perfect for adding a touch of royal elegance to any outfit." },
  { id: 4, slug: "sapphire-infinity-ring", name: "Sapphire Infinity Ring", price: "$1,800", category: "Rings", image: "/images/bridal.png", description: "Deep blue sapphires intertwined in a timeless infinity band." },
  { id: 5, slug: "rose-gold-chain", name: "Rose Gold Chain", price: "$450", category: "Necklaces", image: "/images/minimalist.png", description: "A delicate 14k rose gold chain, perfect for layering." },
  { id: 6, slug: "pearl-cluster-earrings", name: "Pearl Cluster Earrings", price: "$600", category: "Earrings", image: "/images/emerald.png", description: "Lustrous freshwater pearls clustered in a vintage-inspired setting." },
];

export const getProductBySlug = (slug: string) => {
  return products.find(p => p.slug === slug) || products[0];
};

export const adminStats = [
  { label: "Total Revenue", value: "$45,231.00", trend: "+12.5%" },
  { label: "Active Orders", value: "34", trend: "+4.2%" },
  { label: "Conversion Rate", value: "3.24%", trend: "-0.8%" },
  { label: "Total Customers", value: "1,429", trend: "+18.1%" },
];

export const adminRecentOrders = [
  { id: "#AURA-4921", customer: "Sarah Jenkins", total: "$2,400.00", status: "Out for Delivery" },
  { id: "#AURA-4920", customer: "Michael Chen", total: "$850.00", status: "Processing" },
  { id: "#AURA-4919", customer: "Emma Watson", total: "$3,200.00", status: "Shipped" },
  { id: "#AURA-4918", customer: "Olivia Davis", total: "$450.00", status: "Delivered" },
];
