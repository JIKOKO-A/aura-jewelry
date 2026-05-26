"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: { name: string } | string;
  image: string;
  description?: string;
  stock_quantity: number;
}

export interface CartItem {
  id?: number; // Backend DB ID
  product: CartProduct;
  quantity: number;
  size: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: CartProduct, quantity: number, size: string | null) => Promise<void>;
  removeFromCart: (productId: number, size: string | null) => Promise<void>;
  updateQuantity: (productId: number, size: string | null, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartSubtotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, token } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Load cart initially
  useEffect(() => {
    if (user && token) {
      fetchCartFromDB(token);
    } else {
      const localCart = localStorage.getItem("aura_cart");
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          console.error("Failed to parse local cart", e);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [user, token]);

  const fetchCartFromDB = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Map backend CartItem properties to frontend format
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
            },
            quantity: item.quantity,
            size: item.size
          };
        });
        setCartItems(items);
      }
    } catch (error) {
      console.error("Error fetching cart from database:", error);
    }
  };

  const addToCart = async (product: CartProduct, quantity: number, size: string | null) => {
    // Check stock limit
    const existing = cartItems.find(
      (item) => item.product.id === product.id && item.size === size
    );
    const newQty = (existing ? existing.quantity : 0) + quantity;
    if (newQty > product.stock_quantity) {
      toast.error(`Only ${product.stock_quantity} pieces available in stock.`);
      return;
    }

    if (user && token) {
      try {
        const res = await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity,
            size,
          }),
        });

        if (res.ok) {
          await fetchCartFromDB(token);
          toast.success("Added to bag ✓");
          setIsCartOpen(true);
        } else {
          toast.error("Failed to add to database cart.");
        }
      } catch (error) {
        console.error("Error adding to database cart:", error);
      }
    } else {
      // Local cart
      const updatedCart = [...cartItems];
      const index = updatedCart.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (index > -1) {
        updatedCart[index].quantity += quantity;
      } else {
        updatedCart.push({ product, quantity, size });
      }

      setCartItems(updatedCart);
      localStorage.setItem("aura_cart", JSON.stringify(updatedCart));
      toast.success("Added to bag ✓");
      setIsCartOpen(true);
    }
  };

  const removeFromCart = async (productId: number, size: string | null) => {
    const existing = cartItems.find(
      (item) => item.product.id === productId && item.size === size
    );

    if (user && token && existing?.id) {
      try {
        const res = await fetch(`${API_URL}/cart/${existing.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          await fetchCartFromDB(token);
          toast.success("Removed from bag");
        }
      } catch (error) {
        console.error("Error removing from database cart:", error);
      }
    } else {
      const updatedCart = cartItems.filter(
        (item) => !(item.product.id === productId && item.size === size)
      );
      setCartItems(updatedCart);
      localStorage.setItem("aura_cart", JSON.stringify(updatedCart));
      toast.success("Removed from bag");
    }
  };

  const updateQuantity = async (productId: number, size: string | null, quantity: number) => {
    const existing = cartItems.find(
      (item) => item.product.id === productId && item.size === size
    );

    if (!existing) return;

    if (quantity > existing.product.stock_quantity) {
      toast.error(`Only ${existing.product.stock_quantity} pieces available in stock.`);
      return;
    }

    if (user && token && existing.id) {
      try {
        const res = await fetch(`${API_URL}/cart/${existing.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ quantity }),
        });

        if (res.ok) {
          await fetchCartFromDB(token);
        }
      } catch (error) {
        console.error("Error updating quantity in database cart:", error);
      }
    } else {
      const updatedCart = cartItems.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
      setCartItems(updatedCart);
      localStorage.setItem("aura_cart", JSON.stringify(updatedCart));
    }
  };

  const clearCart = async () => {
    if (user && token) {
      // Clear database cart
      // Loop over items and delete them
      for (const item of cartItems) {
        if (item.id) {
          await fetch(`${API_URL}/cart/${item.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
        }
      }
      setCartItems([]);
    } else {
      setCartItems([]);
      localStorage.removeItem("aura_cart");
    }
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
