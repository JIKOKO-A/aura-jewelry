"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  aura_points: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    // Load token from localStorage
    const savedToken = localStorage.getItem("aura_auth_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token might have expired or been revoked
        localStorage.removeItem("aura_auth_token");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUserProfile(token);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("aura_auth_token", data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        
        // Sync local cart to DB
        const localCart = localStorage.getItem("aura_cart");
        if (localCart) {
          try {
            const parsed = JSON.parse(localCart);
            if (parsed.length > 0) {
              await fetch(`${API_URL}/cart/sync`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.access_token}`,
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  items: parsed.map((item: any) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    size: item.size
                  }))
                })
              });
              localStorage.removeItem("aura_cart");
            }
          } catch (e) {
            console.error("Error syncing cart on login", e);
          }
        }

        if (data.user.is_admin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        return true;
      } else {
        toast.error(data.message || "Failed to log in. Check credentials.");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("aura_auth_token", data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        toast.success(`Account created! Welcome to Aura, ${data.user.name}.`);
        router.push("/dashboard");
        return true;
      } else {
        const errorMsg = data.errors 
          ? Object.values(data.errors).flat().join(" ")
          : (data.message || "Registration failed.");
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    localStorage.removeItem("aura_auth_token");
    setToken(null);
    setUser(null);
    toast.success("Signed out successfully.");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
