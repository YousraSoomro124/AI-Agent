import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="max-w-[1440px] mx-auto px-lg py-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl mb-xl">
          <div>
            <div className="flex items-center gap-sm mb-md">
              <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-base">
                N
              </div>
              <span className="font-bold text-lg text-primary font-headline">NexaCart</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Modern AI-augmented customer support for intelligent shopping, order tracking, and hassle-free returns.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-primary text-sm mb-md">Customer Support</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/chat" className="hover:text-secondary">AI Live Support</Link></li>
              <li><Link href="/order-support" className="hover:text-secondary">Track Your Order</Link></li>
              <li><Link href="/refunds" className="hover:text-secondary">Refunds & Returns</Link></li>
              <li><Link href="/product-help" className="hover:text-secondary">Product Questions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary text-sm mb-md">Store Policies</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><span className="text-on-surface-variant">Return Policy: 30 days (15d electronics)</span></li>
              <li><span className="text-on-surface-variant">Refund Processing: 5 business days</span></li>
              <li><span className="text-on-surface-variant">Shipping: Free standard over $50</span></li>
              <li><span className="text-on-surface-variant">Warranty: 1-Year manufacturer</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary text-sm mb-md">Need Human Support?</h4>
            <p className="text-sm text-on-surface-variant mb-2">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
            <p className="text-sm text-on-surface-variant mb-1">Email: <strong>support@techmart.com</strong></p>
            <p className="text-sm text-on-surface-variant">Phone: <strong>1-800-TECHMART</strong></p>
          </div>
        </div>
        <div className="border-t border-outline-variant/60 pt-md text-center text-xs text-on-surface-variant opacity-80">
          © 2024 NexaCart Support System. All rights reserved. Powered by Live RAG & Gemini AI.
        </div>
      </div>
    </footer>
  );
}
