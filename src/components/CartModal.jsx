// src/components/CartModal.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Portal from "./Portal";
import CartItem from "./CartItem";
import { useCart } from "../context/CartContext";
import { getProducts } from "../api/dataService";

export default function CartModal({ isOpen, onClose }) {
  // Hooks (always called, in the same order)
  const { cart, loading: cartLoading, addToCart, setQuantity, removeFromCart, clearAll } = useCart();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // fetch product details to map IDs to names/prices for display
  useEffect(() => {
    let mounted = true;
    setLoadingProducts(true);
    getProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(data || []);
      })
      .catch((e) => {
        console.error("getProducts error in CartModal:", e);
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoadingProducts(false);
      });
    return () => { mounted = false; };
  }, []);

  // lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // build a lookup map for fast access (always declared)
  const productsMap = useMemo(() => {
    const m = new Map();
    for (const p of products) m.set(String(p.id), p);
    return m;
  }, [products]);

  const total = useMemo(() => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((sum, item) => {
      const p = productsMap.get(String(item.product_id)) || {};
      const price = Number(p.price ?? 0);
      return sum + (item.quantity ?? 0) * price;
    }, 0);
  }, [cart, productsMap]);

  // now it's safe to bail out of render early (hooks already called)
  if (!isOpen) return null;

  return (
    <Portal>
      {/* backdrop */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          aria-hidden
        />
        <div className="relative w-full md:max-w-3xl mx-4">
          <div className="bg-base-300 rounded-t-lg md:rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-base-200">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-sm text-error" onClick={clearAll}>Clear</button>
                <button className="btn btn-ghost btn-sm text-info" onClick={onClose}>Close</button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {cartLoading || loadingProducts ? (
                <div className="p-6">
                  <div className="text-center text-sm text-muted">Loading cart…</div>
                </div>
              ) : cart.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-lg font-medium">Your cart is empty</div>
                  <div className="text-sm text-muted mt-2">Add medicines to the cart to see them here.</div>
                </div>
              ) : (
                cart.map((item) => (
                  <CartItem
                    key={item.product_id}
                    item={item}
                    product={productsMap.get(String(item.product_id))}
                    onIncrease={async (productId) => {
                      // add +1
                      await addToCart(productId, 1);
                    }}
                    onDecrease={async (productId) => {
                      // decrease by 1
                      await addToCart(productId, -1);
                    }}
                    onRemove={async (productId) => {
                      await removeFromCart(productId);
                    }}
                  />
                ))
              )}
            </div>

            <div className="p-4 border-t border-base-200 flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1">
                <div className="text-sm text-muted">Total</div>
                <div className="text-2xl font-semibold">₹{total.toFixed(2)}</div>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Continue shopping
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // simple checkout stub: you can integrate payment or order flow here
                    alert(`Checked out (demo). Total: ₹${total.toFixed(2)}`);
                    onClose();
                  }}
                  disabled={cart.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
