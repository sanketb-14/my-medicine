// src/components/Portal.jsx
"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";


export default function Portal({ children, id = "cart-portal" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
    return () => {
      // keep element for reuse — don't remove on unmount to avoid portal re-creation flicker
    };
  }, [id]);

  if (!mounted) return null;
  const container = document.getElementById(id);
  if (!container) return null;
  return createPortal(children, container);
}
