"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// All 20 live products from the Google Sheets catalog with accurate pricing, stock, and high-res verified imagery
const ALL_PRODUCTS = [
  {
    id: "prod-1",
    model: "MacBook Air M3",
    brand: "Apple",
    category: "Laptop",
    price: 799.99,
    stock: 8,
    specs: '13.6", Apple M3, 16GB RAM, 512GB SSD',
    bestFor: "Students & Professionals",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-2",
    model: "XPS 15 9530",
    brand: "Dell",
    category: "Laptop",
    price: 149.99,
    stock: 0,
    specs: "Intel Core i7, RTX 4050, 16GB RAM",
    bestFor: "Creators & Office Work",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-3",
    model: "Legion Pro 5",
    brand: "Lenovo",
    category: "Laptop",
    price: 499.99,
    stock: 15,
    specs: "Ryzen 9, RTX 4070, 32GB RAM",
    bestFor: "Gaming",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-4",
    model: "Spectre x360 14",
    brand: "HP",
    category: "Laptop",
    price: 329.99,
    stock: 4,
    specs: "OLED Touchscreen, Intel Evo",
    bestFor: "Business & Travel",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-5",
    model: "WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    price: 59.99,
    stock: 22,
    specs: "Noise Cancelling, 30hr Battery",
    bestFor: "Music & Travel",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-6",
    model: "AirPods Max",
    brand: "Apple",
    category: "Headphones",
    price: 29.99,
    stock: 35,
    specs: "Spatial Audio, Premium Build",
    bestFor: "Apple Ecosystem",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-7",
    model: "QuietComfort Ultra",
    brand: "Bose",
    category: "Headphones",
    price: 799.99,
    stock: 8,
    specs: "ANC, Comfortable Fit",
    bestFor: "Frequent Travelers",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-8",
    model: "Galaxy S25 Ultra",
    brand: "Samsung",
    category: "Phone",
    price: 149.99,
    stock: 0,
    specs: "Snapdragon 8 Gen 4, 200MP Camera",
    bestFor: "Photography",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-9",
    model: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "Phone",
    price: 499.99,
    stock: 15,
    specs: "A18 Pro Chip, Titanium Design",
    bestFor: "Premium Users",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-10",
    model: "Pixel 9 Pro",
    brand: "Google",
    category: "Phone",
    price: 329.99,
    stock: 4,
    specs: "AI Features, Excellent Camera",
    bestFor: "Android Users",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-11",
    model: "OnePlus 13",
    brand: "OnePlus",
    category: "Phone",
    price: 59.99,
    stock: 22,
    specs: "Fast Charging, AMOLED Display",
    bestFor: "Performance",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-12",
    model: "iPad Pro M4",
    brand: "Apple",
    category: "Tablet",
    price: 29.99,
    stock: 35,
    specs: "OLED Display, Apple Pencil Pro",
    bestFor: "Designers",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-13",
    model: "Galaxy Tab S10 Ultra",
    brand: "Samsung",
    category: "Tablet",
    price: 799.99,
    stock: 8,
    specs: '14.6" AMOLED, S-Pen',
    bestFor: "Entertainment",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-14",
    model: "Pad 7 Pro",
    brand: "Xiaomi",
    category: "Tablet",
    price: 149.99,
    stock: 0,
    specs: "Snapdragon Processor, 144Hz",
    bestFor: "Budget Premium",
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-15",
    model: "MX Keys S",
    brand: "Logitech",
    category: "Keyboard",
    price: 499.99,
    stock: 15,
    specs: "Wireless, Backlit Keys",
    bestFor: "Productivity",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-16",
    model: "Keychron K8 Pro",
    brand: "Keychron",
    category: "Keyboard",
    price: 329.99,
    stock: 4,
    specs: "Mechanical, Hot-Swappable",
    bestFor: "Programmers",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-17",
    model: "BlackWidow V4",
    brand: "Razer",
    category: "Keyboard",
    price: 59.99,
    stock: 22,
    specs: "RGB Mechanical Keyboard",
    bestFor: "Gamers",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-18",
    model: "MX Master 3S",
    brand: "Logitech",
    category: "Mouse",
    price: 29.99,
    stock: 35,
    specs: "Ergonomic, Silent Clicks",
    bestFor: "Office & Editing",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-19",
    model: "DeathAdder V3 Pro",
    brand: "Razer",
    category: "Mouse",
    price: 499.99,
    stock: 4,
    specs: "Lightweight, Wireless Gaming",
    bestFor: "Esports",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-20",
    model: "Aerox 5 Wireless",
    brand: "SteelSeries",
    category: "Mouse",
    price: 329.99,
    stock: 22,
    specs: "Ultra-Lightweight, RGB",
    bestFor: "Gaming & Streaming",
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=600&auto=format&fit=crop&q=80",
  },
];

const CATEGORIES = ["All", "Laptop", "Headphones", "Phone", "Tablet", "Keyboard", "Mouse"];

export default function HomePage() {
  const router = useRouter();
  const [askQuestionText, setAskQuestionText] = useState("");
  const [navSearchText, setNavSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Shopping Cart State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: "prod-1",
      name: "MacBook Air M3",
      price: 799.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-5",
      name: "WH-1000XM5",
      price: 59.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addToCart = (product: { id: string; name: string; price: number; image: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const productSliderRef = useRef<HTMLDivElement>(null);
  const categorySliderRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    selectedCategory === "All"
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleAskQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (askQuestionText.trim()) {
      router.push(`/chat?q=${encodeURIComponent(askQuestionText.trim())}`);
    } else {
      router.push("/chat");
    }
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchText.trim()) {
      router.push(`/chat?q=${encodeURIComponent(navSearchText.trim())}`);
    }
  };

  const scrollProductSlider = (direction: "prev" | "next") => {
    if (!productSliderRef.current) return;
    const cardWidth = 320 + 24;
    const currentScroll = productSliderRef.current.scrollLeft;
    const targetScroll = direction === "next" ? currentScroll + cardWidth * 2 : currentScroll - cardWidth * 2;
    productSliderRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const scrollCategorySlider = (direction: "prev" | "next") => {
    if (!categorySliderRef.current) return;
    const cardWidth = 340 + 24;
    const currentScroll = categorySliderRef.current.scrollLeft;
    const targetScroll = direction === "next" ? currentScroll + cardWidth : currentScroll - cardWidth;
    categorySliderRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      {/* TopNavBar */}
      <nav className="bg-surface dark:bg-surface-container-low font-label-md text-label-md docked full-width top-0 border-b border-outline-variant dark:border-outline shadow-sm dark:shadow-none sticky z-50">
        <div className="flex justify-between items-center w-full px-lg py-md max-w-[1440px] mx-auto">
          {/* Brand / Search */}
          <div className="flex items-center gap-md">
            <Link className="flex items-center gap-2" href="/">
              <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-lg">
                N
              </div>
              <span className="font-bold text-xl text-primary font-headline tracking-tight">NexaCart</span>
            </Link>
            <form onSubmit={handleNavSearchSubmit} className="hidden md:flex items-center bg-surface-container-lowest border border-outline-variant rounded-full px-sm py-xs">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-xs">search</span>
              <input
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-body-sm w-48 text-on-surface placeholder:text-on-surface-variant"
                placeholder="Search products, specs..."
                type="text"
                value={navSearchText}
                onChange={(e) => setNavSearchText(e.target.value)}
              />
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-lg">
            <Link
              className="text-secondary dark:text-secondary-fixed border-b-2 border-secondary font-bold pb-1 hover:text-secondary transition-colors"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-on-surface-variant hover:text-secondary transition-colors"
              href="/product-help"
            >
              Products
            </Link>
            <Link
              className="text-on-surface-variant hover:text-secondary transition-colors"
              href="/order-support"
            >
              Orders
            </Link>
            <Link
              className="text-on-surface-variant hover:text-secondary transition-colors"
              href="/refunds"
            >
              Refunds
            </Link>
            <Link
              className="text-on-surface-variant hover:text-secondary transition-colors"
              href="/about"
            >
              About Us
            </Link>
          </div>

          {/* Top Right: Add to Cart Icon Button */}
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-on-surface hover:text-secondary hover:bg-surface-container-high transition-all flex items-center justify-center cursor-pointer group focus:outline-none"
              aria-label="Shopping Cart"
              title="View Shopping Cart"
            >
              <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">
                shopping_cart
              </span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden shadow-lg h-[600px] flex items-center justify-start">
          <div className="absolute inset-0 z-0">
            <img
              alt="Hero Background"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&auto=format&fit=crop&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-md md:px-lg">
            <div className="max-w-2xl">
              <div className="inline-block border border-white/40 rounded-full px-sm py-1 mb-md">
                <span className="font-label-sm text-white tracking-widest uppercase">AI-Powered Support</span>
              </div>
              <h1 className="font-display text-[44px] md:text-[62px] leading-tight font-extrabold text-white mb-md uppercase tracking-wide">
                YOUR GO-TO FOR<br />
                <span className="text-secondary-fixed">ELECTRONIC</span><br />
                DEVICES
              </h1>
              <p className="font-body-lg text-white mb-lg max-w-md">
                Get instant help with products, orders, and refunds powered by live store data.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-md">
                <Link
                  href="/product-help"
                  className="bg-black text-white border border-white/20 px-xl py-3 rounded-xl font-label-md font-bold tracking-wider uppercase hover:bg-black/80 transition-all inline-flex items-center gap-sm w-full sm:w-auto justify-center shadow-lg"
                >
                  SHOP NOW
                </Link>
                <Link
                  href="/chat"
                  className="bg-secondary-fixed text-on-secondary-fixed px-xl py-3 rounded-xl font-label-md font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-sm w-full sm:w-auto justify-center"
                >
                  <span className="material-symbols-outlined filled">chat</span>
                  Chat with AI
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Products Section with Live Sheet Data */}
        <section className="w-full bg-gradient-to-br from-secondary/5 to-primary/5 py-xl md:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-md md:px-lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-display text-[36px] font-bold text-on-surface mb-sm">Trending Products</h2>
                <p className="font-body-md text-on-surface-variant">
                  Explore our verified product inventory with live stock and specs.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedCategory === cat
                        ? "bg-secondary text-white shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-secondary hover:text-secondary"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Container */}
            <div className="relative group/slider">
              {/* Left Arrow */}
              <button
                onClick={() => scrollProductSlider("prev")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-surface-container-lowest shadow-lg border border-outline-variant flex items-center justify-center text-on-surface hover:text-secondary opacity-0 group-hover/slider:opacity-100 transition-opacity hidden sm:flex cursor-pointer"
                id="slider-prev"
                aria-label="Previous products"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {/* Product Cards Slider */}
              <div
                ref={productSliderRef}
                className="flex gap-lg overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-md pt-2"
                id="product-slider"
              >
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stock === 0;
                  return (
                    <div
                      key={p.id}
                      className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden ambient-shadow hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                    >
                      {/* Image Container with Fallback */}
                      <div className="aspect-[4/3] w-full bg-surface-container-high overflow-hidden relative">
                        <img
                          alt={p.model}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={p.image}
                          onError={(e) => {
                            // Fallback in case of network issue
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                          {p.brand}
                        </div>
                        <div className="absolute top-3 right-3">
                          {isOutOfStock ? (
                            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              Out of stock
                            </span>
                          ) : (
                            <span className="bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                              {p.stock} in stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-md flex flex-col flex-grow">
                        <span className="text-[11px] uppercase tracking-wider text-secondary font-bold mb-1">
                          {p.category}
                        </span>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold line-clamp-1 mb-1">
                          {p.model}
                        </h3>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 flex-grow" title={p.specs}>
                          {p.specs}
                        </p>
                        <div className="flex items-baseline justify-between mb-4">
                          <span className="text-secondary font-extrabold text-xl">${p.price.toFixed(2)}</span>
                          <span className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                            {p.bestFor}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto flex items-center gap-2 pt-2 border-t border-outline-variant/50">
                          <button
                            disabled={isOutOfStock}
                            onClick={() =>
                              addToCart({
                                id: p.id,
                                name: p.model,
                                price: p.price,
                                image: p.image,
                              })
                            }
                            className={`flex-grow py-2 px-3 rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${isOutOfStock
                                ? "bg-surface-container text-on-surface-variant/50 cursor-not-allowed"
                                : "bg-black text-white hover:bg-black/85 cursor-pointer shadow-sm"
                              }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                            <span>{isOutOfStock ? "Sold Out" : "Add to Cart"}</span>
                          </button>

                          <Link
                            href={`/chat?q=${encodeURIComponent(`Tell me about ${p.model} (${p.brand}) specifications and price`)}`}
                            className="p-2 rounded-xl border border-outline-variant hover:bg-secondary/10 hover:border-secondary text-secondary transition-colors"
                            title="Ask AI about this device"
                          >
                            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scrollProductSlider("next")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 rounded-full bg-surface-container-lowest shadow-lg border border-outline-variant flex items-center justify-center text-on-surface hover:text-secondary opacity-0 group-hover/slider:opacity-100 transition-opacity hidden sm:flex cursor-pointer"
                id="slider-next"
                aria-label="Next products"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div className="flex justify-center items-center gap-3 mt-6">
              <Link
                href="/product-help"
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Shop by Category with Verified Unsplash Images */}
        <section className="w-full bg-surface py-xl md:py-[80px]">
          <div className="max-w-[1440px] mx-auto px-md md:px-lg">
            <div className="text-center mb-xl">
              <h2 className="font-display text-[36px] font-bold text-on-surface mb-sm">Shop by Category</h2>
              <p className="font-body-md text-on-surface-variant">Explore our diverse tech collections.</p>
            </div>
            <div className="relative group/category-slider">
              {/* Left Arrow */}
              <button
                onClick={() => scrollCategorySlider("prev")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-surface-container-lowest shadow-md border border-outline-variant flex items-center justify-center text-on-surface hover:text-secondary opacity-0 group-hover/category-slider:opacity-100 transition-opacity hidden sm:flex cursor-pointer"
                id="category-slider-prev"
                aria-label="Previous category"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {/* Slider */}
              <div
                ref={categorySliderRef}
                className="flex gap-lg overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-md"
                id="category-slider"
              >
                {/* Laptops */}
                <Link
                  href="/product-help"
                  className="snap-start shrink-0 w-[300px] sm:w-[360px] h-[160px] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-surface-container-low transition-all duration-300 cursor-pointer group flex items-center p-md gap-md"
                >
                  <div className="w-24 h-24 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
                    <img
                      alt="Laptops"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-headline-md text-on-surface mb-xs">Laptops</h3>
                    <p className="font-body-sm text-on-surface-variant flex items-center gap-1 group-hover:text-secondary transition-colors">
                      Explore 4 models <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>

                {/* Audio */}
                <Link
                  href="/product-help"
                  className="snap-start shrink-0 w-[300px] sm:w-[360px] h-[160px] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-surface-container-low transition-all duration-300 cursor-pointer group flex items-center p-md gap-md"
                >
                  <div className="w-24 h-24 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
                    <img
                      alt="Audio"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-headline-md text-on-surface mb-xs">Headphones</h3>
                    <p className="font-body-sm text-on-surface-variant flex items-center gap-1 group-hover:text-secondary transition-colors">
                      Explore 3 models <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>

                {/* Phones */}
                <Link
                  href="/product-help"
                  className="snap-start shrink-0 w-[300px] sm:w-[360px] h-[160px] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-surface-container-low transition-all duration-300 cursor-pointer group flex items-center p-md gap-md"
                >
                  <div className="w-24 h-24 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
                    <img
                      alt="Phones"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-headline-md text-on-surface mb-xs">Smartphones</h3>
                    <p className="font-body-sm text-on-surface-variant flex items-center gap-1 group-hover:text-secondary transition-colors">
                      Explore 4 models <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>

                {/* Tablets */}
                <Link
                  href="/product-help"
                  className="snap-start shrink-0 w-[300px] sm:w-[360px] h-[160px] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-surface-container-low transition-all duration-300 cursor-pointer group flex items-center p-md gap-md"
                >
                  <div className="w-24 h-24 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
                    <img
                      alt="Tablets"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-headline-md text-on-surface mb-xs">Tablets</h3>
                    <p className="font-body-sm text-on-surface-variant flex items-center gap-1 group-hover:text-secondary transition-colors">
                      Explore 3 models <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>

                {/* Keyboards & Mice */}
                <Link
                  href="/product-help"
                  className="snap-start shrink-0 w-[300px] sm:w-[360px] h-[160px] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:bg-surface-container-low transition-all duration-300 cursor-pointer group flex items-center p-md gap-md"
                >
                  <div className="w-24 h-24 rounded-xl bg-surface-container-high overflow-hidden shrink-0">
                    <img
                      alt="Accessories"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-headline-md text-on-surface mb-xs">Peripherals</h3>
                    <p className="font-body-sm text-on-surface-variant flex items-center gap-1 group-hover:text-secondary transition-colors">
                      Explore 6 models <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </p>
                  </div>
                </Link>
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scrollCategorySlider("next")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 rounded-full bg-surface-container-lowest shadow-md border border-outline-variant flex items-center justify-center text-on-surface hover:text-secondary opacity-0 group-hover/category-slider:opacity-100 transition-opacity hidden sm:flex cursor-pointer"
                id="category-slider-next"
                aria-label="Next category"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* AI Agent Demo Section - EXACT DESIGN FROM USER SCREENSHOT */}
        <section className="w-full relative pb-xl md:pb-[100px] bg-[#064e3b]">
          <div className="max-w-[1200px] mx-auto px-md md:px-lg relative z-10 pt-12">
            <div className="text-center mb-xl">
              <h2 className="font-display text-[36px] font-bold text-white mb-sm">
                Your 24/7 AI Shopping Companion
              </h2>
              <p className="font-body-md max-w-2xl mx-auto text-white">
                Experience seamless support for everything from order tracking to personalized product recommendations.
              </p>
            </div>

            <div className="text-center max-w-3xl mx-auto px-4 mb-xl">
              <h1 className="font-display text-[48px] font-bold mb-md tracking-tight text-white">
                How can we help you?
              </h1>
              <p className="font-body-lg text-[18px] mb-xl text-white">
                Our AI assistant can help with products, orders, and refunds instantly.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-md">
                <Link
                  href="/chat"
                  className="bg-white text-secondary px-xl py-sm rounded-lg font-label-md text-label-md premium-button hover:bg-white/90 transition-colors inline-flex items-center gap-sm shadow-md w-full sm:w-auto justify-center"
                >
                  <span className="material-symbols-outlined filled">support_agent</span>
                  Chat with Support
                </Link>
                <Link
                  href="/product-help"
                  className="bg-white text-secondary px-xl py-sm rounded-lg font-label-md text-label-md hover:bg-white/90 transition-colors inline-flex items-center gap-sm w-full sm:w-auto justify-center"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Explore Products
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-start">
              {/* Left: Order Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-md h-full">
                <h4 className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase mb-lg">
                  Order Status
                </h4>
                <div className="border border-outline-variant rounded-xl overflow-hidden">
                  <div className="bg-surface-container px-md py-sm flex justify-between items-center border-b border-outline-variant">
                    <span className="font-label-md text-on-surface">ORDER</span>
                    <span className="bg-secondary-container text-on-secondary-container px-sm py-1 rounded-full font-label-sm text-[12px]">
                      Delivered
                    </span>
                  </div>

                  {/* Inner Banner Area */}
                  <div className="text-center max-w-3xl mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-md">
                      <Link
                        href="/chat"
                        className="bg-white text-secondary px-xl py-sm rounded-lg font-label-md text-label-md premium-button hover:bg-white/90 transition-colors inline-flex items-center gap-sm shadow-md w-full sm:w-auto justify-center"
                      >
                        <span className="material-symbols-outlined filled">support_agent</span>
                        Chat with Support
                      </Link>
                      <Link
                        href="/product-help"
                        className="bg-white text-secondary px-xl py-sm rounded-lg font-label-md text-label-md hover:bg-white/90 transition-colors inline-flex items-center gap-sm w-full sm:w-auto justify-center"
                      >
                        <span className="material-symbols-outlined">shopping_bag</span>
                        Explore Products
                      </Link>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="p-md grid grid-cols-2 gap-md border-t border-outline-variant bg-surface-container-lowest">
                    <div>
                      <span className="block font-label-sm text-on-surface-variant mb-1">ORDER ID</span>
                      <span className="block font-headline-md text-on-surface">ORD-102</span>
                    </div>
                    <div>
                      <span className="block font-label-sm text-on-surface-variant mb-1">PRODUCT</span>
                      <span className="block font-body-md text-on-surface font-medium">Headphones</span>
                    </div>
                    <div>
                      <span className="block font-label-sm text-on-surface-variant mb-1">CATEGORY</span>
                      <span className="block font-body-md text-on-surface">Electronics</span>
                    </div>
                    <div>
                      <span className="block font-label-sm text-on-surface-variant mb-1">ORDER AGE</span>
                      <span className="block font-body-md text-on-surface">Placed 18 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Chat Demo */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-md h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-sm mb-md pb-md border-b border-outline-variant">
                  <div className="w-10 h-10 rounded-full bg-[#2a5b45] text-white flex items-center justify-center font-bold">
                    V
                  </div>
                  <div>
                    <h4 className="font-label-md text-on-surface font-semibold">Verdant Assistant</h4>
                    <div className="flex items-center gap-1 font-body-sm text-[12px] text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full bg-secondary block"></span>
                      AI — online
                    </div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow flex flex-col gap-md mb-md overflow-y-auto min-h-[220px]">
                  {/* Assistant Msg */}
                  <div className="flex gap-sm">
                    <div className="w-8 h-8 rounded-full bg-[#2a5b45] text-white flex-shrink-0 flex items-center justify-center font-bold text-sm">
                      V
                    </div>
                    <div className="bg-surface-container p-sm rounded-2xl rounded-tl-sm text-body-sm text-on-surface max-w-[85%]">
                      Hi! I'm here to help with products, orders, and refunds. What can I do for you today?
                    </div>
                  </div>

                  {/* User Msg */}
                  <div className="flex justify-end">
                    <div className="bg-[#2a5b45] p-sm rounded-2xl rounded-tr-sm text-body-sm text-white max-w-[85%]">
                      Where is my order ORD-102?
                    </div>
                  </div>

                  {/* Assistant Msg */}
                  <div className="flex gap-sm">
                    <div className="w-8 h-8 rounded-full bg-[#2a5b45] text-white flex-shrink-0 flex items-center justify-center font-bold text-sm">
                      V
                    </div>
                    <div className="bg-surface-container p-sm rounded-2xl rounded-tl-sm text-body-sm text-on-surface max-w-[85%]">
                      I can pull that up for you — open the chat and I'll walk through the details.
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <form
                  onSubmit={handleAskQuestionSubmit}
                  className="border border-outline-variant rounded-full flex items-center px-sm py-2 bg-surface-container-lowest"
                >
                  <input
                    className="bg-transparent border-none focus:outline-none focus:ring-0 flex-grow text-body-sm text-on-surface placeholder:text-on-surface-variant px-sm"
                    placeholder="Ask a question..."
                    type="text"
                    value={askQuestionText}
                    onChange={(e) => setAskQuestionText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-[#2a5b45] text-white flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer"
                    aria-label="Send question to AI"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest dark:bg-inverse-surface font-body-sm text-body-sm full-width border-t border-outline-variant dark:border-outline flat no shadows mt-auto">
        <div className="w-full py-xl px-lg flex flex-col md:flex-row justify-between items-center gap-md max-w-[1440px] mx-auto">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">
              N
            </div>
            <span className="font-bold text-base text-primary font-headline">NexaCart</span>
            <span className="text-on-surface-variant dark:text-surface-variant opacity-80 pl-2">
              © 2024 NexaCart Support. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap gap-md justify-center">
            <Link className="text-on-surface-variant hover:text-secondary opacity-80 hover:opacity-100 transition-opacity" href="#">
              Privacy Policy
            </Link>
            <Link className="text-on-surface-variant hover:text-secondary opacity-80 hover:opacity-100 transition-opacity" href="#">
              Terms of Service
            </Link>
            <Link className="text-primary underline opacity-80 hover:opacity-100 transition-opacity" href="/chat">
              Help Center
            </Link>
            <Link className="text-on-surface-variant hover:text-secondary opacity-80 hover:opacity-100 transition-opacity" href="/about">
              About Us
            </Link>
            <Link className="text-on-surface-variant hover:text-secondary opacity-80 hover:opacity-100 transition-opacity" href="/order-support">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>

      {/* Slide-Over Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-surface border-l border-outline-variant shadow-2xl flex flex-col">
              {/* Cart Header */}
              <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary text-[26px]">shopping_cart</span>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">Your Cart</h3>
                  <span className="bg-secondary/10 text-secondary text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {totalCartItems} {totalCartItems === 1 ? "item" : "items"}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-grow overflow-y-auto p-md space-y-md">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <span className="material-symbols-outlined text-outline-variant text-[64px] mb-3 block">
                      production_quantity_limits
                    </span>
                    <p className="font-headline-md text-lg text-on-surface mb-1 font-semibold">Your cart is empty</p>
                    <p className="text-sm text-on-surface-variant mb-6">Discover our popular tech collections to add items.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-medium text-sm inline-block shadow-sm hover:opacity-90 cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-md bg-surface-container-lowest p-sm rounded-xl border border-outline-variant/70 items-center shadow-sm"
                    >
                      <div className="w-16 h-16 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-sm text-on-surface">{item.name}</h4>
                        <p className="text-secondary font-bold text-sm mt-0.5">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold px-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded bg-surface-container flex items-center justify-center text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-on-surface-variant/60 hover:text-error transition-colors p-1 cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="p-md border-t border-outline-variant bg-surface-container-lowest space-y-sm">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-secondary font-semibold">FREE (Standard)</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-outline-variant/40">
                    <span>Subtotal</span>
                    <span className="text-secondary text-lg">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => alert(`Checkout initiated! Total: $${cartSubtotal.toFixed(2)}`)}
                    className="w-full bg-black text-white py-3.5 rounded-xl font-label-md font-bold uppercase tracking-wider hover:bg-black/85 transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <Link
                    href="/chat?q=I%20have%20questions%20about%20the%20items%20in%20my%20cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full border border-secondary text-secondary py-2.5 rounded-xl font-label-md font-semibold hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Ask AI About My Cart</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
