// src/components/CartItem.jsx
"use client";
import React, { useState } from "react";

/**
 * CartItem
 * props:
 * - item: { product_id, quantity }
 * - product: { id, name, price, image_url }
 * - onIncrease, onDecrease, onRemove
 */
export default function CartItem({ item, product = {}, onIncrease, onDecrease, onRemove }) {
  const [busy, setBusy] = useState(false);
  const qty = item.quantity ?? 0;
  const price = Number(product.price ?? 0);
  const subtotal = (qty * price).toFixed(2);

  const handle = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-3 items-center p-3 border-b border-accent">
      <img
        src={"https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"}
        alt={product.name}
        className="w-20 h-14 object-cover rounded"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className="font-medium truncate text-info">{product.name || `Product ${item.product_id}`}</h4>
          <div className="text-sm text-muted">₹{price.toLocaleString()}</div>
        </div>

        <p className="text-xs text-muted mt-1 truncate">{product.description ?? ""}</p>

        <div className="mt-3 flex items-center gap-3">
          <div className="btn-group">
            <button
              className="btn btn-sm"
              onClick={() => handle(() => onDecrease(item.product_id))}
              disabled={busy || qty <= 0}
            >
              −
            </button>
            <span className="btn btn-disabled btn-sm text-info">{qty}</span>
            <button
              className="btn btn-sm"
              onClick={() => handle(() => onIncrease(item.product_id))}
              disabled={busy}
            >
              +
            </button>
          </div>

          <div className="ml-3 text-sm">Subtotal: <strong className="text-accent">₹{subtotal}</strong></div>

          <button
            className="btn btn-ghost btn-sm ml-auto text-error"
            onClick={() => handle(() => onRemove(item.product_id))}
            disabled={busy}
            aria-label={`Remove ${product.name}`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
