// src/components/CartButton.jsx
"use client";
import React, { useMemo, useState } from "react";
import CartModal from "./CartModal";
import { useCart } from "../context/CartContext";

export default function CartButton() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const totalCount = useMemo(() => (cart || []).reduce((s, it) => s + (it.quantity || 0), 0), [cart]);

  return (
    <>
      <button
        className="fixed right-2 top-2 z-40 btn btn-primary btn-circle btn-xl shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6.2A2 2 0 0 0 7.8 21h8.4a2 2 0 0 0 2-1.8L19 13M7 13H5.4" />
        </svg>

        {totalCount > 0 && (
          <span className="badge badge-secondary absolute -top-2 -right-2">{totalCount}</span>
        )}
      </button>

      <CartModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
