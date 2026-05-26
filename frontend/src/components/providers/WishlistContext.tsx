"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { CartProduct } from "./CartContext";

interface WishlistItem {
  id?: number;
  product: CartProduct;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  toggleWishlist: (product: CartProduct) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user, token } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Load wishlist initially
  useEffect(() => {
    if (user && token) {
      fetchWishlistFromDB(token);
    } else {
      const localWishlist = localStorage.getItem("aura_wishlist");
      if (localWishlist) {
        try {
          setWishlistItems(JSON.parse(localWishlist));
        } catch (e) {
          console.error("Failed to parse local wishlist", e);
        }
      } else {
        setWishlistItems([]);
      }
    }
  }, [user, token]);

  const fetchWishlistFromDB = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const items = data.map((item: any) => {
          const primaryImage = item.product.images?.find((img: any) => img.is_primary)?.image_path || "/images/minimalist.png";
          return {
            id: item.id,
            product: {
              id: item.product.id,
              name: item.product.name,
              slug: item.product.slug,
              price: parseFloat(item.product.price),
              category: item.product.category,
              image: primaryImage,
              stock_quantity: item.product.stock_quantity
            }
          };
        });
        setWishlistItems(items);
      }
    } catch (error) {
      console.error("Error fetching wishlist from database:", error);
    }
  };

  const refreshWishlist = async () => {
    if (token) {
      await fetchWishlistFromDB(token);
    }
  };

  const toggleWishlist = async (product: CartProduct) => {
    const existing = wishlistItems.find((item) => item.product.id === product.id);

    if (user && token) {
      try {
        if (existing) {
          // Remove
          const res = await fetch(`${API_URL}/wishlist/${product.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (res.ok) {
            setWishlistItems(wishlistItems.filter((item) => item.product.id !== product.id));
            toast.success("Removed from wishlist");
          }
        } else {
          // Add
          const res = await fetch(`${API_URL}/wishlist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: JSON.stringify({ product_id: product.id }),
          });

          if (res.ok) {
            await fetchWishlistFromDB(token);
            toast.success("Saved to wishlist ♥");
          }
        }
      } catch (error) {
        console.error("Error toggling database wishlist:", error);
      }
    } else {
      // Local wishlist for guests
      let updatedWishlist = [...wishlistItems];
      if (existing) {
        updatedWishlist = updatedWishlist.filter((item) => item.product.id !== product.id);
        toast.success("Removed from wishlist");
      } else {
        updatedWishlist.push({ product });
        toast.success("Saved to wishlist ♥");
      }
      setWishlistItems(updatedWishlist);
      localStorage.setItem("aura_wishlist", JSON.stringify(updatedWishlist));
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some((item) => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
