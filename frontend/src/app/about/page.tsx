"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const values = [
    {
      icon: "smart_toy",
      title: "AI-Augmented Shopping",
      description:
        "We harness cutting-edge Retrieval-Augmented Generation (RAG) and Google Gemini AI to provide instant product specs, live stock queries, and transparent policy answers.",
    },
    {
      icon: "verified",
      title: "Hassle-Free Returns",
      description:
        "No waiting on hold. Our automated policy engine evaluates return requests dynamically against our 15-day electronics and 30-day general goods policy with instant decision emails.",
    },
    {
      icon: "local_shipping",
      title: "Live Order Intelligence",
      description:
        "Direct synchronization with live order tracking databases ensures customers always have up-to-the-minute updates on shipping and delivery milestones.",
    },
    {
      icon: "support_agent",
      title: "24/7 Human & AI Synergy",
      description:
        "Our intelligent assistant is always on standby to resolve questions in seconds, with seamless escalation to human specialists whenever complex cases arise.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body-md antialiased">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-md md:px-lg py-12 md:py-20">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block border border-secondary/30 bg-secondary/5 rounded-full px-sm py-1 mb-md">
            <span className="font-label-sm text-secondary tracking-widest uppercase">About NexaCart</span>
          </div>
          <h1 className="font-display text-[40px] md:text-[54px] font-bold text-on-surface mb-md tracking-tight">
            The Future of Intelligent E-Commerce
          </h1>
          <p className="font-body-lg text-on-surface-variant text-[18px] leading-relaxed">
            NexaCart was founded to revolutionize how customers shop for tech products online by fusing premium electronics with instant, conversational AI support.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-outline-variant aspect-[4/3] bg-surface-container-high relative">
            <img
              alt="NexaCart Experience"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white font-headline-md text-xl font-semibold">
                Customer-First Innovation Powered by Live AI
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-bold text-on-surface">
              Built for speed, accuracy, and customer satisfaction
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Traditional customer service often involves lengthy wait times, repeated explanations, and rigid policies. NexaCart eliminates this friction by integrating our live product catalogs, order records, and return policies directly with generative AI.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Whether you are checking if your headphones are still within the return window, comparing laptop specifications, or tracking an in-transit order, our 24/7 AI shopping companion gives you exact, verified answers in seconds.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="/product-help"
                className="bg-black text-white px-6 py-3 rounded-xl font-label-md font-bold uppercase tracking-wider hover:bg-black/80 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Explore Products</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                href="/chat"
                className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-label-md font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Talk to Support</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-on-surface mb-2">Our Core Pillars</h2>
            <p className="text-on-surface-variant">How NexaCart sets the standard for modern e-commerce.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">{v.icon}</span>
                </div>
                <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">{v.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed flex-grow">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
