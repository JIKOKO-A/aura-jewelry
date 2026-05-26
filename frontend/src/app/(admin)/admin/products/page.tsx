"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthContext";
import { Loader2, Plus, Edit2, Trash2, X, Star, EyeOff, Package } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form states
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [imagePath, setImagePath] = useState("/images/minimalist.png");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const loadData = async () => {
    if (!token) return;
    try {
      // Load products
      const prodRes = await fetch(`${API_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      // Load categories
      const catRes = await fetch(`${API_URL}/categories`);
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (err) {
      console.error("Error loading product panel details:", err);
      toast.error("Failed to load catalog details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const openAddModal = () => {
    setEditingProduct(null);
    setCategoryId(categories[0]?.id || "");
    setName("");
    setPrice("");
    setStockQuantity("");
    setDescription("");
    setSku("");
    setIsFeatured(false);
    setIsActive(true);
    setImagePath("/images/minimalist.png");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setCategoryId(prod.category_id || "");
    setName(prod.name || "");
    setPrice(prod.price || "");
    setStockQuantity(prod.stock_quantity || "0");
    setDescription(prod.description || "");
    setSku(prod.sku || "");
    setIsFeatured(prod.is_featured === 1 || prod.is_featured === true);
    setIsActive(prod.is_active === 1 || prod.is_active === true);
    
    const primaryImg = prod.images?.find((img: any) => img.is_primary)?.image_path || "/images/minimalist.png";
    setImagePath(primaryImg);
    
    setIsModalOpen(true);
  };

  const handleDelete = async (prodId: number) => {
    if (!window.confirm("Are you sure you wish to delete this item?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/products/${prodId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("Product deleted successfully.");
        setProducts(products.filter((p) => p.id !== prodId));
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Database connection failure.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    const payload = {
      category_id: parseInt(categoryId),
      name,
      description,
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity),
      sku: sku.trim() || null,
      is_featured: isFeatured,
      is_active: isActive,
      image_path: imagePath
    };

    const url = editingProduct 
      ? `${API_URL}/admin/products/${editingProduct.id}` 
      : `${API_URL}/admin/products`;
      
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingProduct ? "Product details updated." : "New product cataloged.");
        setIsModalOpen(false);
        loadData(); // Reload list
      } else {
        toast.error(data.message || "Failed to submit form.");
      }
    } catch (err) {
      console.error("Product submit error:", err);
      toast.error("Database connection failure.");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-20">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-10 text-neutral-800">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-neutral-900 leading-tight">Product Catalog</h1>
          <p className="font-sans text-xs text-neutral-500 mt-1 uppercase tracking-wider">Configure showcase items and inventory</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-neutral-900 text-white font-sans text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-sm flex items-center gap-2"
        >
          <Plus size={16} /> Catalog Piece
        </button>
      </div>

      {/* Grid List */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-100 bg-neutral-50/50">
          <h2 className="font-serif text-lg text-neutral-900 font-medium">Active Inventory ({products.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 bg-neutral-50/20">
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Preview</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Name & SKU</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Category</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Price</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Stock Count</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px]">Flags</th>
                <th className="px-8 py-4 font-normal uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const primaryImg = prod.images?.find((img: any) => img.is_primary)?.image_path || "/images/minimalist.png";
                return (
                  <tr key={prod.id} className="border-b border-neutral-100 hover:bg-neutral-50/30 transition-colors">
                    {/* Thumbnail */}
                    <td className="px-8 py-4">
                      <div className="relative w-10 h-12 border border-neutral-200 overflow-hidden bg-neutral-50">
                        <Image src={primaryImg} alt={prod.name} fill className="object-cover" />
                      </div>
                    </td>
                    {/* Name & SKU */}
                    <td className="px-8 py-4">
                      <p className="font-serif text-sm font-semibold text-neutral-950">{prod.name}</p>
                      <p className="font-sans text-[10px] text-neutral-400 tracking-wider mt-0.5 uppercase">{prod.sku}</p>
                    </td>
                    {/* Category */}
                    <td className="px-8 py-4 text-neutral-600 font-medium">{prod.category?.name || "Unassigned"}</td>
                    {/* Price */}
                    <td className="px-8 py-4 text-neutral-950 font-bold">MAD {parseFloat(prod.price).toLocaleString()}</td>
                    {/* Stock */}
                    <td className="px-8 py-4">
                      <span className={`flex items-center gap-1.5 font-medium ${prod.stock_quantity === 0 ? "text-red-500 font-bold" : prod.stock_quantity <= 3 ? "text-amber-500" : "text-neutral-600"}`}>
                        <Package size={13} /> {prod.stock_quantity} units
                      </span>
                    </td>
                    {/* Flags */}
                    <td className="px-8 py-4">
                      <div className="flex gap-2">
                        {(prod.is_featured === 1 || prod.is_featured === true) && (
                          <span className="p-1 bg-amber-50 text-amber-500 rounded-full border border-amber-200/50" title="Featured Showcase">
                            <Star size={11} fill="currentColor" />
                          </span>
                        )}
                        {!(prod.is_active === 1 || prod.is_active === true) && (
                          <span className="p-1 bg-neutral-100 text-neutral-400 rounded-full border border-neutral-200" title="Inactive Display">
                            <EyeOff size={11} />
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-4 text-right">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 rounded-md transition-colors"
                          title="Modify details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 p-8 max-w-lg w-full shadow-2xl rounded-sm text-neutral-800 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif text-xl font-medium mb-6">
              {editingProduct ? "Modify Showcase Piece" : "Catalog New Piece"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-5 text-left font-sans text-xs">
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[9px] uppercase tracking-widest text-neutral-400">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="border border-neutral-200 px-3 py-2 rounded-sm focus:outline-none focus:border-gold h-9 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {/* SKU */}
                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[9px] uppercase tracking-widest text-neutral-400">SKU (e.g. AURA-SLUG)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="border border-neutral-200 px-3 py-2 rounded-sm focus:outline-none focus:border-gold h-9"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[9px] uppercase tracking-widest text-neutral-400">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sapphire Infinity Ring"
                  className="border border-neutral-200 px-3 py-2 rounded-sm focus:outline-none focus:border-gold h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[9px] uppercase tracking-widest text-neutral-400">Price (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1800"
                    className="border border-neutral-200 px-3 py-2 rounded-sm focus:outline-none focus:border-gold h-9"
                  />
                </div>
                {/* Stock */}
                <div className="flex flex-col space-y-1">
                  <label className="font-sans text-[9px] uppercase tracking-widest text-neutral-400">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="e.g. 10"
                    className="border border-neutral-200 px-3 py-2 rounded-sm focus:outline-none focus:border-gold h-9"
                  />
                </div>
              </div>

              {/* Image Path Selection */}
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[9px] uppercase tracking-widest text-neutral-400">Display Image Path</label>
                <select
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                  className="border border-neutral-200 px-3 py-2 rounded-sm focus:outline-none focus:border-gold h-9 bg-white"
                >
                  <option value="/images/bridal.png">Bridal Elegance (bridal.png)</option>
                  <option value="/images/minimalist.png">Minimalist Gold (minimalist.png)</option>
                  <option value="/images/emerald.png">Royal Emerald (emerald.png)</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[9px] uppercase tracking-widest text-neutral-400">Story/Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the cut, color, clarity, and brand story..."
                  className="border border-neutral-200 px-3 py-2 rounded-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 border-t border-b border-neutral-100 py-3">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  <span>Showcase as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  <span>Publish Active Listing</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 h-10 border border-neutral-200 uppercase tracking-widest hover:bg-neutral-50 transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-1/2 h-10 bg-neutral-900 text-white uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 rounded-sm disabled:opacity-50"
                >
                  {formSubmitting ? <Loader2 size={12} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
