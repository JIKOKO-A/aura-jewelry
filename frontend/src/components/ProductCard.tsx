"use client";

import Image from "next/image";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart, CartProduct } from "./providers/CartContext";
import { useWishlist } from "./providers/WishlistContext";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  category?: { name: string; slug: string } | string;
  images?: Array<{ image_path: string; is_primary: boolean }>;
  image?: string; // Fallback
  stock_quantity: number;
  description?: string;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  category,
  images,
  image,
  stock_quantity,
  description,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  // Format price
  const numericPrice = typeof price === "number" ? price : parseFloat(price);
  const formattedPrice = `MAD ${numericPrice.toLocaleString()}`;

  // Get primary image
  const primaryImage = images?.find((img) => img.is_primary)?.image_path || image || "/images/minimalist.png";

  // Get category name
  const categoryName = typeof category === "object" ? category.name : (category || "Jewelry");

  // Construct product object for cart
  const productData: CartProduct = {
    id,
    name,
    slug,
    price: numericPrice,
    category: categoryName,
    image: primaryImage,
    description,
    stock_quantity,
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(productData, 1, null);
    setIsAdding(false);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productData);
  };

  const isFavorite = isInWishlist(id);

  return (
    <Link href={`/shop/${slug}`} className="group cursor-pointer flex flex-col w-full relative">
      <div className="relative overflow-hidden aspect-[4/5] mb-5 bg-foreground/5 rounded-sm">
        {/* Product Image */}
        <Image 
          src={primaryImage} 
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
        
        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 p-2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full text-foreground/80 hover:text-red-500 shadow-sm z-20 transition-all duration-300 transform hover:scale-110"
          title={isFavorite ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart size={15} fill={isFavorite ? "#ef4444" : "none"} className={isFavorite ? "text-red-500" : ""} />
        </button>

        {/* Out of Stock Badge */}
        {stock_quantity === 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white font-sans text-[9px] uppercase tracking-widest px-3 py-1 font-semibold rounded-sm">
            Sold Out
          </div>
        )}

        {/* Hover Add to Cart Button */}
        {stock_quantity > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 w-[90%] z-10">
            <button 
              onClick={handleAdd}
              disabled={isAdding}
              className="w-full bg-background text-foreground py-3 font-sans text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors duration-300 disabled:opacity-70"
            >
              {isAdding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <ShoppingBag size={14} strokeWidth={1.5} /> Add to Bag
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex justify-between items-start px-1">
        <div className="min-w-0 pr-2">
          <p className="font-sans text-[9px] text-foreground/50 uppercase tracking-[0.2em] mb-1">{categoryName}</p>
          <h3 className="font-serif text-base text-foreground group-hover:text-gold transition-colors duration-300 truncate">{name}</h3>
        </div>
        <p className="font-sans text-sm tracking-wider text-foreground flex-shrink-0 font-medium">{formattedPrice}</p>
      </div>
    </Link>
  );
}
