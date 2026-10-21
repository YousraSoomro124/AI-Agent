"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/product-help", label: "Products" },
    { href: "/order-support", label: "Orders" },
    { href: "/refunds", label: "Refunds" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <header className="bg-surface shadow-sm border-b border-outline-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-lg py-md max-w-[1440px] mx-auto">
        <div className="flex items-center gap-lg">
          <Link href="/" className="flex items-center gap-sm">
            <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-lg">
              N
            </div>
            <span className="font-bold text-xl text-primary font-headline tracking-tight">
              NexaCart
            </span>
          </Link>
          <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-sm py-xs border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-xs">
              search
            </span>
            <input
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-on-surface w-48 placeholder-on-surface-variant"
              placeholder="Search help articles..."
              type="text"
            />
          </div>
        </div>

        <nav className="hidden md:flex gap-md items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-sm transition-colors py-1 ${
                  isActive
                    ? "text-secondary border-b-2 border-secondary font-semibold"
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-md">
          {/* Cart Icon */}
          <Link
            href="/#cart"
            className="relative p-2 rounded-full text-on-surface hover:text-secondary hover:bg-surface-container-high transition-all flex items-center justify-center group"
            aria-label="View Shopping Cart"
            title="Shopping Cart"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
              shopping_cart
            </span>
            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              2
            </span>
          </Link>

          <Link
            href="/chat"
            className="bg-secondary text-on-secondary px-4 py-2 rounded-full font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Chat with support</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
