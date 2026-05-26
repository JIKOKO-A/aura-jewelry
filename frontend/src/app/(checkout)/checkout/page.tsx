"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartContext";
import { useAuth } from "@/components/providers/AuthContext";
import { ArrowLeft, CreditCard, Truck, Loader2, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

// Initialize Stripe outside of rendering
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51OzK3VE1gK1iZgM5qC6Vp4iU3534b8c9d0e1f2a3"
);

export default function Checkout() {
  const { cartItems, cartSubtotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-foreground text-center">
        <div className="max-w-md mx-auto py-20">
          <h1 className="font-serif text-3xl mb-4">Your Shopping Bag is Empty</h1>
          <p className="font-sans text-sm text-foreground/60 mb-8 leading-relaxed">
            Please add luxury pieces to your bag before proceeding to checkout.
          </p>
          <Link href="/shop" className="px-8 py-3.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors inline-block rounded-sm">
            Explore Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 md:px-12 bg-background text-foreground">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/shop" 
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-12 w-max font-sans text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-12">Secure Checkout</h1>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </main>
  );
}

function CheckoutForm() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");
  
  // Shipping form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Autofill email when user state changes
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please sign in or register before checking out.");
      router.push("/login");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not fully loaded. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      let stripePaymentIntentId = null;

      // 1. Process Stripe Payment if selected
      if (paymentMethod === "stripe") {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          toast.error("Card information is required.");
          setIsSubmitting(false);
          return;
        }

        // Call backend to create payment intent
        const intentRes = await fetch(`${API_URL}/payments/intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            amount: cartSubtotal,
            currency: "mad"
          }),
        });

        const intentData = await intentRes.json();
        
        if (!intentRes.ok) {
          throw new Error(intentData.error || "Failed to initialize credit card transaction.");
        }

        const clientSecret = intentData.clientSecret;

        // If running in Mock Mode (no Stripe key set in backend env), bypass actual Stripe confirmation
        if (clientSecret.startsWith("mock_secret_")) {
          stripePaymentIntentId = clientSecret;
          toast.info("Running in Stripe Mock Mode. Bypassing bank gateway.");
        } else {
          // Confirm payment on client side
          const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${firstName} ${lastName}`,
                email,
                phone,
                address: {
                  line1: streetAddress,
                  postal_code: zipCode,
                  city,
                  country: "MA"
                }
              }
            }
          });

          if (paymentResult.error) {
            throw new Error(paymentResult.error.message || "Payment transaction declined.");
          }

          if (paymentResult.paymentIntent?.status === "succeeded") {
            stripePaymentIntentId = paymentResult.paymentIntent.id;
          } else {
            throw new Error("Payment transaction is incomplete.");
          }
        }
      }

      // 2. Register Order in Database
      const orderPayload = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        street_address: streetAddress,
        zip_code: zipCode,
        city,
        payment_method: paymentMethod,
        stripe_payment_intent_id: stripePaymentIntentId,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size
        }))
      };

      const orderRes = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();

      if (orderRes.ok) {
        toast.success("Order placed successfully!");
        await clearCart();
        router.push(`/checkout/success?order_number=${orderData.order.order_number}`);
      } else {
        throw new Error(orderData.message || "Failed to register order.");
      }

    } catch (error: any) {
      console.error("Checkout process error:", error);
      toast.error(error.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      {/* Left: Form */}
      <div className="lg:col-span-2">
        <form className="space-y-12" onSubmit={handleSubmit}>
          
          {/* Shipping Info */}
          <section className="space-y-6">
            <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 border-b border-foreground/10 pb-2 flex items-center justify-between">
              <span>Shipping Information</span>
              {user && <span className="text-[10px] text-gold uppercase tracking-wider">Authenticated Client</span>}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">First Name</label>
                <input 
                  type="text" 
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Sarah" 
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Last Name</label>
                <input 
                  type="text" 
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Jenkins" 
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                />
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com" 
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                />
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +212 600-000000" 
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                />
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Street Address</label>
                <input 
                  type="text" 
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street name, apartment, suite" 
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Zip Code</label>
                <input 
                  type="text" 
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g. 20250" 
                  className="bg-transparent border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors" 
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">City</label>
                <select 
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-background border border-foreground/20 px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer h-12"
                >
                  <option value="" disabled>Select City</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tangier">Tangier</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Fes">Fes</option>
                  <option value="Meknes">Meknes</option>
                  <option value="Oujda">Oujda</option>
                  <option value="Kenitra">Kenitra</option>
                  <option value="Tetouan">Tetouan</option>
                  <option value="Other">Other City</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="font-sans text-[10px] uppercase tracking-widest text-foreground/50">Country</label>
                <input 
                  type="text" 
                  value="Morocco" 
                  disabled 
                  className="bg-foreground/5 border border-foreground/10 px-4 py-3 font-sans text-sm text-foreground/50 cursor-not-allowed" 
                />
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section className="space-y-6">
            <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 border-b border-foreground/10 pb-2">
              Payment Details
            </h2>
            
            <div className="space-y-6">
              {/* Toggle Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex items-center gap-3 px-4 py-3.5 border font-sans text-xs uppercase tracking-widest transition-all rounded-sm ${
                    paymentMethod === "stripe"
                      ? "border-gold bg-gold/5 text-foreground font-semibold"
                      : "border-foreground/10 text-foreground/60 hover:border-foreground/35"
                  }`}
                >
                  <CreditCard size={16} /> Credit Card (Stripe)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-3 px-4 py-3.5 border font-sans text-xs uppercase tracking-widest transition-all rounded-sm ${
                    paymentMethod === "cod"
                      ? "border-gold bg-gold/5 text-foreground font-semibold"
                      : "border-foreground/10 text-foreground/60 hover:border-foreground/35"
                  }`}
                >
                  <Truck size={16} /> Cash on Delivery
                </button>
              </div>
              
              {/* Stripe Form Container */}
              {paymentMethod === "stripe" && (
                <div className="border border-foreground/10 p-5 rounded-sm space-y-4 bg-foreground/[0.01]">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-foreground/50 mb-2">Card Details</p>
                  <div className="p-3 border border-foreground/20 bg-background rounded-sm">
                    <CardElement 
                      options={{
                        style: {
                          base: {
                            fontSize: "14px",
                            color: "var(--foreground)",
                            fontFamily: "var(--font-inter), sans-serif",
                            "::placeholder": {
                              color: "rgba(var(--foreground-rgb), 0.35)",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <p className="font-sans text-[10px] text-neutral-400 leading-normal flex items-center gap-1">
                    <Lock size={10} /> Fully encrypted, secure payments via Stripe gateway.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="border border-gold/15 bg-gold/5 p-5 rounded-sm">
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                    <strong>Cash on Delivery (Morocco Only):</strong> Pay in cash to our courier upon secure hand-delivery. Complimentary shipping applies.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Place Order Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-foreground text-background font-sans text-xs uppercase tracking-widest py-4 hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing Order...
              </>
            ) : (
              `Complete Order — MAD ${cartSubtotal.toLocaleString()}`
            )}
          </button>
        </form>
      </div>

      {/* Right: Summary */}
      <div className="bg-foreground/5 border border-foreground/10 p-6 md:p-8 rounded-sm h-max lg:sticky lg:top-24">
        <h2 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 border-b border-foreground/10 pb-2 mb-6">
          Order Summary
        </h2>
        
        {/* Items List */}
        <div className="max-h-72 overflow-y-auto no-scrollbar space-y-6 mb-6">
          {cartItems.map((item, i) => (
            <div key={`${item.product.id}-${item.size}-${i}`} className="flex gap-4 items-center">
              <div className="relative w-14 h-16 bg-background border border-foreground/5 flex-shrink-0">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm text-foreground truncate">{item.product.name}</h3>
                <p className="font-sans text-[10px] text-foreground/50 uppercase mt-0.5">
                  {item.size ? `Size ${item.size} • ` : ""}Qty {item.quantity}
                </p>
              </div>
              <p className="font-sans text-xs font-semibold text-foreground">
                MAD {(item.product.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        
        {/* Totals */}
        <div className="space-y-4 font-sans text-sm border-t border-foreground/10 pt-6">
          <div className="flex justify-between text-foreground/75 text-xs uppercase tracking-wider">
            <span>Subtotal</span>
            <span>MAD {cartSubtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-foreground/75 text-xs uppercase tracking-wider">
            <span>Shipping</span>
            <span className="text-gold font-medium">Complimentary</span>
          </div>
          <div className="flex justify-between font-serif text-lg font-bold pt-4 border-t border-foreground/10 text-foreground">
            <span>Estimated Total</span>
            <span>MAD {cartSubtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
