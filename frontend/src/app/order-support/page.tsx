"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderRecord {
  id: string;
  customer: string;
  product: string;
  category: string;
  daysAgo: number;
  status: string;
  carrier: string;
  trackingNumber: string;
  returnEligible: boolean;
  returnReason: string;
}

export default function OrderSupportPage() {
  const [searchId, setSearchId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<OrderRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Customer order dataset (queried individually by customer Order ID)
  const ordersDatabase: OrderRecord[] = [
    {
      id: "ORD-101",
      customer: "Ali",
      product: "Laptop (MacBook Air M3)",
      category: "Electronics",
      daysAgo: 40,
      status: "Delivered",
      carrier: "FedEx Express",
      trackingNumber: "FX-9402847101",
      returnEligible: false,
      returnReason: "Exceeds 15-day electronics return window (delivered 40 days ago).",
    },
    {
      id: "ORD-102",
      customer: "Sara",
      product: "Headphones (Sony WH-1000XM5)",
      category: "Electronics",
      daysAgo: 18,
      status: "Delivered",
      carrier: "UPS Ground",
      trackingNumber: "1Z999999920184",
      returnEligible: false,
      returnReason: "Exceeds 15-day electronics return window (delivered 18 days ago).",
    },
    {
      id: "ORD-103",
      customer: "John",
      product: "Phone (iPhone 15 Pro)",
      category: "Electronics",
      daysAgo: 3,
      status: "Delivered",
      carrier: "DHL Express",
      trackingNumber: "DHL-4810398203",
      returnEligible: true,
      returnReason: "Within 15-day electronics return window (delivered 3 days ago).",
    },
    {
      id: "ORD-104",
      customer: "Mia",
      product: "Tablet (iPad Air 5th Gen)",
      category: "Electronics",
      daysAgo: 22,
      status: "Delivered",
      carrier: "FedEx Express",
      trackingNumber: "FX-8392019404",
      returnEligible: false,
      returnReason: "Exceeds 15-day electronics return window (delivered 22 days ago).",
    },
    {
      id: "ORD-105",
      customer: "Abis",
      product: "Headphones (AirPods Pro)",
      category: "Electronics",
      daysAgo: 18,
      status: "Delivered",
      carrier: "USPS Priority",
      trackingNumber: "940010000000105",
      returnEligible: false,
      returnReason: "Exceeds 15-day electronics return window (delivered 18 days ago).",
    },
    {
      id: "ORD-106",
      customer: "Syed",
      product: "Phone (Galaxy S24)",
      category: "Electronics",
      daysAgo: 7,
      status: "Delivered",
      carrier: "UPS 2-Day Air",
      trackingNumber: "1Z839201061984",
      returnEligible: true,
      returnReason: "Within 15-day electronics return window (delivered 7 days ago).",
    },
    {
      id: "ORD-107",
      customer: "Hussain",
      product: "Headphones (Bose 700)",
      category: "Electronics",
      daysAgo: 10,
      status: "Delivered",
      carrier: "FedEx Ground",
      trackingNumber: "FX-1930284707",
      returnEligible: true,
      returnReason: "Within 15-day electronics return window (delivered 10 days ago).",
    },
  ];

  const handleSearch = (idToLookup?: string) => {
    const term = (idToLookup || searchId).trim().toUpperCase();
    if (!term) return;

    setSearchId(term);
    const found = ordersDatabase.find(
      (o) => o.id.toUpperCase() === term
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-md md:px-lg py-xl">
        {/* Header Hero */}
        <div className="max-w-2xl mx-auto text-center mb-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            <span>Customer Package Tracking</span>
          </div>
          <h1 className="font-display text-[34px] md:text-[42px] font-bold text-primary mb-3 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
            Enter your Order ID to check shipment progress, carrier delivery details, and return eligibility.
          </p>
        </div>

        {/* Search Order Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                receipt_long
              </span>
              <input
                type="text"
                placeholder="Enter your Order ID (e.g. ORD-102, ORD-103)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest pl-14 pr-28 py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm transition-all text-on-surface placeholder:text-on-surface-variant/70"
              />
            </div>
            <button
              type="submit"
              className="absolute right-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-on-secondary-container transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Track</span>
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
          </form>

          {/* Quick lookup suggestion tags */}
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-on-surface-variant">
            <span className="font-medium">Try example order:</span>
            {["ORD-103", "ORD-106", "ORD-102", "ORD-107"].map((exampleId) => (
              <button
                key={exampleId}
                type="button"
                onClick={() => handleSearch(exampleId)}
                className="bg-surface-container hover:bg-surface-container-high px-2.5 py-1 rounded-lg text-secondary font-semibold transition-colors"
              >
                {exampleId}
              </button>
            ))}
          </div>
        </div>

        {/* Search Result Card (Only shows the individual customer's order) */}
        {hasSearched && (
          <div className="max-w-3xl mx-auto mb-16 animate-fadeIn">
            {searchedOrder ? (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-md">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-outline-variant/60">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Order ID:
                      </span>
                      <span className="font-mono font-bold text-lg text-primary">
                        {searchedOrder.id}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      Placed by <strong className="text-on-surface">{searchedOrder.customer}</strong> • Delivered {searchedOrder.daysAgo} days ago
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {searchedOrder.status}
                    </span>
                  </div>
                </div>

                {/* 4-Step Shipping Timeline */}
                <div className="py-6 border-b border-outline-variant/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                    Shipment Progress
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-secondary -z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm shadow-sm mb-1.5">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">Ordered</span>
                      <span className="text-[10px] text-on-surface-variant">Confirmed</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm shadow-sm mb-1.5">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">Processed</span>
                      <span className="text-[10px] text-on-surface-variant">Warehouse</span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm shadow-sm mb-1.5">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">Shipped</span>
                      <span className="text-[10px] text-on-surface-variant">{searchedOrder.carrier}</span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm shadow-sm mb-1.5">
                        <span className="material-symbols-outlined text-[16px]">done_all</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">Delivered</span>
                      <span className="text-[10px] text-on-surface-variant">{searchedOrder.daysAgo}d ago</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-outline-variant/60 text-sm">
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                    <span className="text-xs text-on-surface-variant block mb-1">Item Purchased</span>
                    <strong className="text-primary font-semibold text-base block">
                      {searchedOrder.product}
                    </strong>
                    <span className="text-xs text-on-surface-variant">
                      Category: {searchedOrder.category}
                    </span>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                    <span className="text-xs text-on-surface-variant block mb-1">Carrier & Tracking</span>
                    <strong className="text-primary font-semibold text-base block">
                      {searchedOrder.carrier}
                    </strong>
                    <span className="text-xs font-mono text-on-surface-variant">
                      #{searchedOrder.trackingNumber}
                    </span>
                  </div>
                </div>

                {/* Policy & Return Status */}
                <div className="py-6 border-b border-outline-variant/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Store Return Policy Status
                  </h4>
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      searchedOrder.returnEligible
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                        : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5">
                      {searchedOrder.returnEligible ? "verified" : "info"}
                    </span>
                    <div>
                      <strong className="block text-sm font-semibold mb-0.5">
                        {searchedOrder.returnEligible
                          ? "Eligible for Return or Refund"
                          : "Return Window Expired"}
                      </strong>
                      <p className="text-xs leading-relaxed opacity-90">
                        {searchedOrder.returnReason} Electronics have a strict 15-day return policy from the delivery date.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    href={`/refunds?orderId=${searchedOrder.id}`}
                    className="w-full sm:w-auto bg-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-on-secondary-container transition-colors shadow-sm text-center flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">assignment_return</span>
                    <span>Submit Refund Request</span>
                  </Link>
                  <Link
                    href={`/chat?query=${encodeURIComponent(
                      `I need assistance with my order ${searchedOrder.id} for ${searchedOrder.product}. It was delivered ${searchedOrder.daysAgo} days ago.`
                    )}`}
                    className="w-full sm:w-auto border border-outline-variant bg-surface hover:bg-surface-container text-on-surface px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Ask AI About This Order</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6 bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/60 mb-2">
                  search_off
                </span>
                <h3 className="text-lg font-bold text-primary mb-1">
                  No Order Found for &quot;{searchId}&quot;
                </h3>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
                  Please verify the Order ID from your confirmation email. Order numbers follow the format <strong className="text-primary font-mono">ORD-XXX</strong> (e.g. ORD-102, ORD-103).
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href="/chat?query=How%20can%20I%20find%20my%20order%20ID%3F"
                    className="bg-secondary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-on-secondary-container transition-colors"
                  >
                    Chat with AI Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Help & Policy Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-bold text-xl text-primary mb-1">
              Order Help & Policies
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant">
              Frequently needed information regarding deliveries and order management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">mark_email_read</span>
              </div>
              <h4 className="font-bold text-primary text-sm mb-1.5">Where is my Order ID?</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your Order ID is included in your checkout confirmation email and SMS receipt. It starts with &quot;ORD-&quot; followed by digits (e.g. ORD-103).
              </p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">schedule</span>
              </div>
              <h4 className="font-bold text-primary text-sm mb-1.5">Delivery Timelines</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Standard delivery takes 3-5 business days. Express shipping takes 1-2 business days. Orders placed before 2:00 PM EST dispatch on the same day.
              </p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">replay</span>
              </div>
              <h4 className="font-bold text-primary text-sm mb-1.5">15-Day Return Window</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Electronics have a 15-day return window from the day of confirmed delivery. Items must be in original condition with all accessories included.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
