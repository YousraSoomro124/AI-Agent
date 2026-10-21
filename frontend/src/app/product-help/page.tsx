"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  numericPrice: number;
  specs: string;
  bestFor: string;
  stock: number;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "MacBook Air M3",
    brand: "Apple",
    category: "Laptop",
    price: "$799.99",
    numericPrice: 799.99,
    specs: '13.6", Apple M3 chip, 16GB Unified RAM, 512GB SSD',
    bestFor: "Students & Professionals",
    stock: 8,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-2",
    name: "XPS 15 9530",
    brand: "Dell",
    category: "Laptop",
    price: "$149.99",
    numericPrice: 149.99,
    specs: "Intel Core i7-13700H, RTX 4050, 16GB RAM, 512GB SSD",
    bestFor: "Creators & Office Work",
    stock: 0,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-3",
    name: "Legion Pro 5",
    brand: "Lenovo",
    category: "Laptop",
    price: "$499.99",
    numericPrice: 499.99,
    specs: "AMD Ryzen 9, RTX 4070 8GB, 32GB DDR5, 1TB SSD",
    bestFor: "Hardcore Gaming & Streaming",
    stock: 15,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-4",
    name: "Spectre x360 14",
    brand: "HP",
    category: "Laptop",
    price: "$329.99",
    numericPrice: 329.99,
    specs: "2.8K OLED Touch, Intel Core Ultra 7, 16GB RAM",
    bestFor: "Business & Travel Versatility",
    stock: 4,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-5",
    name: "WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    price: "$59.99",
    numericPrice: 59.99,
    specs: "Dual Processor ANC, 30hr Battery, Multipoint Bluetooth",
    bestFor: "Audiophiles & Commuters",
    stock: 22,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-6",
    name: "AirPods Max",
    brand: "Apple",
    category: "Headphones",
    price: "$29.99",
    numericPrice: 29.99,
    specs: "Computational Audio, Apple H1 chip, Spatial Audio",
    bestFor: "Apple Ecosystem Enthusiasts",
    stock: 35,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-7",
    name: "QuietComfort Ultra",
    brand: "Bose",
    category: "Headphones",
    price: "$799.99",
    numericPrice: 799.99,
    specs: "World-Class Active Noise Cancellation, Immersive Audio",
    bestFor: "Frequent Travelers & Focus",
    stock: 8,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-8",
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    category: "Phone",
    price: "$149.99",
    numericPrice: 149.99,
    specs: "Snapdragon 8 Elite, 200MP Quad Cam, Built-in S-Pen",
    bestFor: "Power Users & Photography",
    stock: 0,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-9",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "Phone",
    price: "$499.99",
    numericPrice: 499.99,
    specs: "Grade 5 Titanium, A18 Pro, 48MP Fusion Camera",
    bestFor: "Content Creators & Mobile Gaming",
    stock: 15,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-10",
    name: "Pixel 9 Pro",
    brand: "Google",
    category: "Phone",
    price: "$329.99",
    numericPrice: 329.99,
    specs: "Google Tensor G4, Gemini Live AI, Pro Triple Camera",
    bestFor: "Pure Android & AI Enthusiasts",
    stock: 4,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-11",
    name: "OnePlus 13",
    brand: "OnePlus",
    category: "Phone",
    price: "$59.99",
    numericPrice: 59.99,
    specs: "Snapdragon 8 Elite, 100W SUPERVOOC, Hasselblad Optics",
    bestFor: "Speed & Rapid Charging",
    stock: 22,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-12",
    name: "iPad Pro M4",
    brand: "Apple",
    category: "Tablet",
    price: "$29.99",
    numericPrice: 29.99,
    specs: "Ultra Retina XDR Tandem OLED, M4 chip, Apple Pencil Pro",
    bestFor: "Digital Illustrators & Animators",
    stock: 35,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-13",
    name: "Galaxy Tab S10 Ultra",
    brand: "Samsung",
    category: "Tablet",
    price: "$799.99",
    numericPrice: 799.99,
    specs: '14.6" Dynamic AMOLED 2X, MediaTek Dimensity 9300+, S-Pen',
    bestFor: "Large-Canvas Multitasking",
    stock: 8,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-14",
    name: "Pad 7 Pro",
    brand: "Xiaomi",
    category: "Tablet",
    price: "$149.99",
    numericPrice: 149.99,
    specs: '11.2" 3.2K 144Hz Screen, Snapdragon 8s Gen 3, 67W Turbo',
    bestFor: "Portable Media & Productivity",
    stock: 0,
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-15",
    name: "MX Keys S",
    brand: "Logitech",
    category: "Keyboard",
    price: "$499.99",
    numericPrice: 499.99,
    specs: "Low-Profile Spherically Dished Keys, Smart Backlighting",
    bestFor: "Coders & Office Efficiency",
    stock: 15,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-16",
    name: "Keychron K8 Pro",
    brand: "Keychron",
    category: "Keyboard",
    price: "$329.99",
    numericPrice: 329.99,
    specs: "QMK/VIA Wireless Custom Mechanical, Hot-Swappable Gateron",
    bestFor: "Mechanical Keyboard Purists",
    stock: 4,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-17",
    name: "BlackWidow V4",
    brand: "Razer",
    category: "Keyboard",
    price: "$59.99",
    numericPrice: 59.99,
    specs: "Razer Green Mechanical Switches, Chroma RGB, Media Dial",
    bestFor: "Tactile Gaming Feedback",
    stock: 22,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-18",
    name: "MX Master 3S",
    brand: "Logitech",
    category: "Mouse",
    price: "$29.99",
    numericPrice: 29.99,
    specs: "8K DPI Any-Surface Tracking, MagSpeed Electromagnetic Wheel",
    bestFor: "Designers, Editors & Ergonomics",
    stock: 35,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-19",
    name: "DeathAdder V3 Pro",
    brand: "Razer",
    category: "Mouse",
    price: "$499.99",
    numericPrice: 499.99,
    specs: "Ultra-lightweight 63g, Focus Pro 30K Optical Sensor",
    bestFor: "Competitive Esports & FPS",
    stock: 4,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-20",
    name: "Aerox 5 Wireless",
    brand: "SteelSeries",
    category: "Mouse",
    price: "$329.99",
    numericPrice: 329.99,
    specs: "74g Lightweight Multi-genre, 9 Programmable Buttons, IP54",
    bestFor: "MOBA, MMO & Action Games",
    stock: 22,
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=600&auto=format&fit=crop&q=80",
  },
];

const CATEGORIES = ["All", "Laptop", "Headphones", "Phone", "Tablet", "Keyboard", "Mouse"];

export default function ProductHelpPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (productName: string) => {
    setCartFeedback(`Added "${productName}" to cart!`);
    setTimeout(() => {
      setCartFeedback(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      {/* Cart notification toast */}
      {cartFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-xl">shopping_bag</span>
          <span className="font-medium text-sm">{cartFeedback}</span>
        </div>
      )}

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-md md:px-lg py-xl">
        {/* Header Hero */}
        <div className="mb-xl text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>Live Catalog • 20 Verified Devices</span>
          </div>
          <h1 className="font-display text-[34px] md:text-[44px] font-bold text-primary mb-3 tracking-tight">
            Electronics & Smart Hardware
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
            Explore authentic laptops, phones, headphones, tablets, and gaming gear. Ask our NexaCart AI Support agent anything about compatibility, warranty, or returns.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-4xl mx-auto mb-10 flex flex-col gap-4">
          {/* Live Search Bar */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, brand (Apple, Dell, Sony...), or specs..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-surface-container border border-outline-variant text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex justify-center gap-2 flex-wrap items-center pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-secondary text-white shadow-md scale-105"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {cat}
                {cat === "All" ? ` (${PRODUCTS.length})` : ` (${PRODUCTS.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Products Results Count */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/60">
          <p className="text-xs md:text-sm text-on-surface-variant font-medium">
            Showing <span className="font-bold text-primary">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "device" : "devices"}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
          <Link
            href="/chat?query=Which%20product%20do%20you%20recommend%20for%20my%20needs%3F"
            className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span>Get AI Buying Advice</span>
          </Link>
        </div>

        {/* Products Grid with High-Res Images */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant my-8">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-2">
              search_off
            </span>
            <h3 className="text-lg font-bold text-primary mb-1">No matching devices found</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Try adjusting your search query or choosing another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="bg-secondary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-secondary/90 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-surface-container-lowest border border-outline-variant/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300"
              >
                <div>
                  {/* Product Card Image Container */}
                  <div className="relative w-full h-52 bg-surface-container-low overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback image in case of network or unsplash throttle
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Overlay for card contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges: Brand & Stock */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                      <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {p.brand}
                      </span>
                      {p.stock > 0 ? (
                        <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          {p.stock} in stock
                        </span>
                      ) : (
                        <span className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          Out of stock
                        </span>
                      )}
                    </div>

                    {/* Bottom Category pill on image */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-[10px] font-semibold bg-surface/90 text-on-surface px-2 py-0.5 rounded shadow-sm">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-base md:text-lg text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-3 leading-relaxed line-clamp-2 h-8">
                      {p.specs}
                    </p>
                    <div className="text-[11px] text-on-surface-variant/90 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/50 mb-2">
                      <strong className="text-on-surface font-semibold">Best for:</strong> {p.bestFor}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Actions */}
                <div className="p-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2 bg-surface-container-lowest">
                  <div>
                    <span className="text-xs text-on-surface-variant block font-medium">Price</span>
                    <span className="text-lg md:text-xl font-bold text-primary tracking-tight">
                      {p.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Add To Cart Quick Action */}
                    <button
                      onClick={() => handleAddToCart(p.name)}
                      disabled={p.stock === 0}
                      title={p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                        p.stock === 0
                          ? "bg-surface-container text-on-surface-variant/40 cursor-not-allowed"
                          : "bg-surface-container hover:bg-secondary hover:text-white text-on-surface"
                      }`}
                      aria-label={`Add ${p.name} to cart`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        add_shopping_cart
                      </span>
                    </button>

                    {/* Ask AI Link */}
                    <Link
                      href={`/chat?query=${encodeURIComponent(`Tell me about the ${p.name} (${p.brand}). What are its key specifications, stock status, and return policy?`)}`}
                      className="bg-secondary text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-on-secondary-container transition-colors inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Ask AI</span>
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h4 className="font-bold text-primary text-base mb-1">1-Year Official Warranty</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Every device in our catalog is guaranteed 100% authentic and covered by a full 1-year manufacturer warranty.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">autorenew</span>
            </div>
            <div>
              <h4 className="font-bold text-primary text-base mb-1">15-Day Return Window</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Changed your mind? Return eligible electronics within 15 days in original packaging with no restocking fee.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div>
              <h4 className="font-bold text-primary text-base mb-1">24/7 AI Tech Assistant</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Get instant answers regarding product specifications, compatibility, and real-time warehouse inventory.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">help</span>
            <span>Frequently Asked Product Questions</span>
          </h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-primary text-sm mb-1.5">
                What warranty comes with electronics?
              </h4>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                All electronics include a standard 1-year manufacturer warranty covering hardware defects. Laptops and desktops come with an optional 2-year extended warranty.
              </p>
            </div>
            <div className="border-t border-outline-variant/50 pt-5">
              <h4 className="font-semibold text-primary text-sm mb-1.5">
                Can I return a laptop, tablet, or phone if I change my mind?
              </h4>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Yes! Under our store return policy, electronics such as laptops, phones, and tablets may be returned within 15 days of purchase in their original packaging.
              </p>
            </div>
            <div className="border-t border-outline-variant/50 pt-5">
              <h4 className="font-semibold text-primary text-sm mb-1.5">
                How fast is shipping for products in stock?
              </h4>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Standard shipping takes 3-5 business days ($4.99 or free on orders over $50). Express shipping takes 1-2 business days ($12.99). Orders placed before 2:00 PM EST dispatch same-day.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
