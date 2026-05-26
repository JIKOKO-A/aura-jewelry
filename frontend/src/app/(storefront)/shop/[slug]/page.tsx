"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart, Ruler, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart, CartProduct } from "@/components/providers/CartContext";
import { useWishlist } from "@/components/providers/WishlistContext";
import { toast } from "sonner";

export default function ProductDetails() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background text-foreground">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    }>
      <ProductDetailsContent />
    </Suspense>
  );
}

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          
          // Get primary image or default
          const primaryImg = data.images?.find((img: any) => img.is_primary)?.image_path || data.images?.[0]?.image_path || "/images/minimalist.png";
          setActiveImage(primaryImg);
        } else {
          setError("Product not found in our catalog.");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Unable to connect to the backend server.");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background text-foreground flex justify-center">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 animate-pulse">
          <div className="aspect-[4/5] bg-foreground/10 rounded-sm w-full" />
          <div className="space-y-6 py-10">
            <div className="h-4 bg-foreground/10 rounded w-1/4" />
            <div className="h-10 bg-foreground/10 rounded w-3/4" />
            <div className="h-6 bg-foreground/10 rounded w-1/3" />
            <div className="space-y-2 pt-10">
              <div className="h-4 bg-foreground/10 rounded w-full" />
              <div className="h-4 bg-foreground/10 rounded w-full" />
              <div className="h-4 bg-foreground/10 rounded w-2/3" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-6 bg-background flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-3xl mb-4">Piece Not Found</h1>
        <p className="font-sans text-sm text-foreground/60 mb-8 max-w-md leading-relaxed">{error || "The requested item is unavailable."}</p>
        <Link href="/shop" className="px-6 py-2.5 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-foreground/80 transition-colors">
          Return to Shop
        </Link>
      </main>
    );
  }

  // Format product details
  const numericPrice = parseFloat(product.price);
  const formattedPrice = `MAD ${numericPrice.toLocaleString()}`;
  const categoryName = product.category?.name || "Jewelry";
  const isRing = categoryName.toLowerCase() === "rings";
  const ringSizes = ["5", "6", "7", "8", "9", "10"];

  // Gather images
  const allImages = product.images?.map((img: any) => img.image_path) || ["/images/minimalist.png"];
  // If only 1 image exists, let's add some mock details shots for visual richness
  if (allImages.length === 1) {
    allImages.push("/images/minimalist.png", "/images/emerald.png");
  }

  const productDetailsList = [
    `Category: ${categoryName}`,
    product.sku ? `SKU: ${product.sku}` : `SKU: AURA-${product.id}`,
    product.stock_quantity > 0 ? `${product.stock_quantity} pieces available` : "Out of stock",
    "Material: 18k Fine Gold / Platinum Option",
  ];

  const cartProduct: CartProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: numericPrice,
    category: categoryName,
    image: allImages[0],
    stock_quantity: product.stock_quantity,
    description: product.description,
  };

  const isFavorite = isInWishlist(product.id);

  const handleAddToBag = async () => {
    if (isRing && !selectedSize) {
      toast.error("Please select a ring size.");
      return;
    }
    
    setIsAdding(true);
    await addToCart(cartProduct, quantity, selectedSize);
    setIsAdding(false);
  };

  const handleCheckoutNow = async () => {
    if (isRing && !selectedSize) {
      toast.error("Please select a ring size.");
      return;
    }
    
    setIsAdding(true);
    await addToCart(cartProduct, quantity, selectedSize);
    setIsAdding(false);
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/shop" 
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-12 w-max font-sans text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
            {/* Thumbnail Stack */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              {allImages.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 flex-shrink-0 border transition-all ${
                    activeImage === img ? "border-foreground/50 opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            
            {/* Active Display Image */}
            <div className="relative w-full aspect-[4/5] bg-foreground/5 overflow-hidden rounded-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <Image src={activeImage} alt={product.name} fill className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              
              {/* Category & Title */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold mb-2">{categoryName}</p>
                  <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-2 leading-tight">{product.name}</h1>
                </div>
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(cartProduct)}
                  className="p-3 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-colors text-foreground hover:text-red-500"
                  title={isFavorite ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} className={isFavorite ? "text-red-500" : ""} />
                </button>
              </div>

              {/* Price */}
              <p className="font-sans text-2xl tracking-widest text-foreground font-semibold mb-8">{formattedPrice}</p>
              
              {/* Description */}
              <p className="font-sans text-foreground/70 leading-relaxed mb-10 max-w-lg text-sm">
                {product.description || "A masterfully drafted heirloom piece. Meticulously shaped and carefully finished to catch the light beautifully. Designed to celebrate significant milestones with enduring brilliance."}
              </p>

              {/* Ring Size Selector */}
              {isRing && (
                <div className="mb-8 border-t border-foreground/10 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/60">Select Ring Size</span>
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="font-sans text-[10px] uppercase tracking-widest text-gold hover:text-gold/80 flex items-center gap-1.5 transition-colors"
                    >
                      <Ruler size={12} /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {ringSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 w-12 font-sans text-xs transition-all border ${
                          selectedSize === size
                            ? "bg-foreground text-background border-foreground font-medium"
                            : "bg-transparent text-foreground border-foreground/20 hover:border-foreground/60"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Specifications */}
              <div className="mb-10 border-t border-foreground/10 pt-6">
                <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-4">Product Specifications</h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {productDetailsList.map((detail, i) => (
                    <li key={i} className="font-sans text-xs text-foreground/80 flex items-center gap-2.5 truncate">
                      <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0" /> {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-8 border-t border-foreground/10">
                {/* Quantity Toggle */}
                {product.stock_quantity > 0 && (
                  <div className="flex items-center border border-foreground/20 px-4 py-3 h-14 w-full sm:w-32 justify-between flex-shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="text-foreground/50 hover:text-foreground transition-colors p-1"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-sans text-sm font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="text-foreground/50 hover:text-foreground transition-colors p-1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
                
                {product.stock_quantity > 0 ? (
                  <>
                    <button 
                      onClick={handleAddToBag}
                      disabled={isAdding}
                      className="flex-1 h-14 border border-foreground text-foreground font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                    >
                      <ShoppingBag size={16} /> Add to Bag
                    </button>
                    <button 
                      onClick={handleCheckoutNow}
                      disabled={isAdding}
                      className="flex-1 h-14 bg-foreground text-background font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
                    >
                      Checkout Now <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                  <button 
                    disabled 
                    className="w-full h-14 bg-foreground/10 text-foreground/40 font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed border border-transparent"
                  >
                    Sold Out
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ring Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSizeGuideOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-foreground/10 p-6 md:p-10 max-w-md w-full shadow-2xl rounded-sm text-foreground relative"
            >
              <h3 className="font-serif text-2xl mb-4">Aura Ring Sizing Guide</h3>
              <p className="font-sans text-sm text-foreground/75 leading-relaxed mb-6">
                To find your perfect fit, wrap a strip of paper or string around the base of your finger. Mark the point where the ends meet, measure it in millimeters, and match it below:
              </p>
              
              <table className="w-full text-left font-sans text-xs border border-foreground/10 mb-6">
                <thead>
                  <tr className="bg-foreground/5 border-b border-foreground/10">
                    <th className="px-4 py-2 font-semibold">US Size</th>
                    <th className="px-4 py-2 font-semibold">Inside Circumference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/5">
                    <td className="px-4 py-2 font-semibold text-gold">Size 5</td>
                    <td className="px-4 py-2">49.3 mm</td>
                  </tr>
                  <tr className="border-b border-foreground/5">
                    <td className="px-4 py-2 font-semibold text-gold">Size 6</td>
                    <td className="px-4 py-2">51.9 mm</td>
                  </tr>
                  <tr className="border-b border-foreground/5">
                    <td className="px-4 py-2 font-semibold text-gold">Size 7</td>
                    <td className="px-4 py-2">54.4 mm</td>
                  </tr>
                  <tr className="border-b border-foreground/5">
                    <td className="px-4 py-2 font-semibold text-gold">Size 8</td>
                    <td className="px-4 py-2">57.0 mm</td>
                  </tr>
                  <tr className="border-b border-foreground/5">
                    <td className="px-4 py-2 font-semibold text-gold">Size 9</td>
                    <td className="px-4 py-2">59.5 mm</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold text-gold">Size 10</td>
                    <td className="px-4 py-2">62.1 mm</td>
                  </tr>
                </tbody>
              </table>

              <button 
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full h-11 border border-foreground font-sans text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
              >
                Close Guide
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
