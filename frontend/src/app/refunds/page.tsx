"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface EmailDraft {
  subject?: string;
  body_text?: string;
  body_html?: string;
}

export default function RefundsPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{

    decision: "accepted" | "rejected";
    message: string;
    emailSent: boolean;
    orderId: string;
    emailDraft?: EmailDraft;
  } | null>(null);

  // Auto-fill orderId from URL query param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paramOrderId = params.get("orderId");
      if (paramOrderId) {
        setOrderId(paramOrderId.toUpperCase());
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!orderId.trim()) {
      setError("Please enter your Order ID (e.g. ORD-102).");
      return;
    }
    if (!email.trim()) {
      setError("Please enter the email address used during checkout.");
      return;
    }
    if (!reason) {
      setError("Please select a reason for your refund request.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId.trim().toUpperCase(),
          email: email.trim(),
          reason,
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.detail || data.message || "Failed to process refund request. Please verify the order ID.");
        return;
      }

      setResult({
        decision: data.decision.toLowerCase() === "accepted" ? "accepted" : "rejected",
        message: data.message,
        emailSent: data.email_sent,
        orderId: data.order_id,
        emailDraft: data.email_draft,
      });
    } catch (err: any) {
      console.error("Refund error:", err);
      setError("Unable to connect to the NexaCart backend. Please ensure the server is running on port 8000.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setOrderId("");
    setEmail("");
    setReason("");
    setDescription("");
    setError(null);
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-md md:px-lg py-xl">
        <div className="max-w-2xl mx-auto">
          <div className="mb-xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              <span>AI Agent Automated Evaluation</span>
            </div>
            <h1 className="font-display text-[34px] md:text-[40px] font-semibold text-primary mb-xs tracking-tight">
              Request a Refund
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg">
              Our AI Support Agent evaluates your order against company policy, generates a personalized response, and sends a formal decision to your email.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] p-lg md:p-xl">
            {error && (
              <div className="mb-lg p-md rounded-xl bg-error-container text-on-error-container border border-error/30 flex items-start gap-sm">
                <span className="material-symbols-outlined text-error mt-0.5">error</span>
                <div className="text-sm font-medium">{error}</div>
              </div>
            )}

            {!result ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-base">
                <div className="flex flex-col gap-base">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">
                      Order ID <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ORD-102, ORD-103"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary uppercase font-mono"
                    />
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      Check your email confirmation receipt for your Order ID.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      The AI Agent will send the decision notice to this email.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">
                      Reason for Return <span className="text-error">*</span>
                    </label>
                    <select
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="" disabled>Select a reason...</option>
                      <option value="defective">Item defective or doesn't work</option>
                      <option value="wrong_item">Received wrong item</option>
                      <option value="not_as_described">Item does not match description</option>
                      <option value="no_longer_needed">No longer needed / Changed mind</option>
                      <option value="damaged_shipping">Damaged in shipping</option>
                      <option value="other">Other reason</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">
                      Additional Details <span className="text-xs text-on-surface-variant font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the issue with the item (e.g. cracked screen, won't turn on, etc.)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-md border-t border-outline-variant flex justify-end gap-sm items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderId("");
                      setEmail("");
                      setReason("");
                      setDescription("");
                    }}
                    className="px-md py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl text-sm font-semibold bg-secondary text-white hover:bg-on-secondary-container transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    <span className="material-symbols-outlined text-[18px]">
                      {submitting ? "hourglass_empty" : "send"}
                    </span>
                    <span>{submitting ? "AI Agent Evaluating..." : "Submit Request"}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* State 2: Clean Submission Confirmation */
              <div className="flex flex-col items-center justify-center py-8 gap-5 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-4xl">task_alt</span>
                </div>

                <div className="max-w-md">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    Your request has been submitted!
                  </h3>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                    We have processed your request and will sent the full details to your email.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center gap-2 text-xs text-on-surface-variant max-w-sm w-full">
                  <span className="material-symbols-outlined text-secondary text-base">mark_email_read</span>
                  <span>Confirmation sent to: <strong className="text-primary">{email}</strong></span>
                </div>



                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-outline text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Policy Highlights Card */}
          <div className="mt-xl p-lg rounded-2xl bg-surface-container-lowest border border-outline-variant text-sm shadow-sm">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              Store Return Policy Quick Reference
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant text-xs md:text-sm">
              <li><strong>Standard Items:</strong> Returnable within 30 days of purchase date in original packaging.</li>
              <li><strong>Electronics (Laptops, Phones, Tablets, Headphones):</strong> Must be returned within 15 days of purchase date.</li>
              <li><strong>Refund Method:</strong> Refunds are processed within 5 business days to the original payment method upon receipt.</li>
              <li><strong>Final Sale:</strong> Items marked "Final Sale" cannot be returned or refunded.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
