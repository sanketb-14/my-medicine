// src/components/ProductList.jsx
import { useState, useEffect } from "react";
import { getProducts } from "../api/dataService";
import ProductItem from "./ProductItem";


/**
 * ProductList - shows products in a responsive grid with Tailwind + DaisyUI
 * - expects products to have: id, name, price, image_url, description
 */
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);


  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (!mounted) return;
        setProducts(data || []);
      } catch (e) {
        console.error("fetchProducts error:", e);
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);



  if (loading) {
    // skeleton grid (3 cols on md/lg)
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-base-200 rounded-lg h-44 w-full mb-3" />
              <div className="h-4 bg-base-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-base-200 rounded w-1/2 mb-4" />
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-base-200 rounded" />
                <div className="h-10 w-20 bg-base-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-4">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M12 6v6" />
            </svg>
            <span>Unable to load products. Try again later.</span>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="alert alert-info">
          <div>
            <span>No products found.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Medicines</h2>
        <span className="text-sm text-muted">Showing {products.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
            
            < ProductItem key={p.id} p={p}/>
        )
          
        )}
      </div>
    </div>
  );
}
