import { createContext, useState, useEffect ,useContext} from "react";
import { getCart } from "../api/dataService";
import { addOrUpdateCartItem, clearCart, removeCartItem, setCartItemQuantity } from "../api/dataAction";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
  
      const fetchCart = async () => {
        
        setLoading(true)
        try{
             if (!mounted) return;
        const data = await getCart();
        setCart(data);
        setLoading(false);
        }
       
      
     catch (err) {
      if (!mounted) return;
      setError(err);
      setLoading(false);
    }

  } 
  fetchCart()
  return () => mounted = false
}
  
  ,[]);


   const addToCart = async (productId, qty = 1) => {
    try {
    
      setCart(prev => {
        const found = prev.find(i => i.product_id === productId);
        if (found) return prev.map(i => i.product_id === productId ? { ...i, quantity: i.quantity + qty } : i);
        return [...prev, { id: Math.random().toString(36).slice(2,9), product_id: productId, quantity: qty }];
      });

      const updated = await addOrUpdateCartItem(productId, qty);
      setCart(updated);
    } catch (err) {
      console.error(err);
      setError(err);
      const fresh = await getCart().catch(() => []);
      setCart(fresh);
    }
  };

  const setQuantity = async (productId, qty) => {
    try {
      setCart(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: qty } : i));
      const updated = await setCartItemQuantity(productId, qty);
      setCart(updated);
    } catch (err) {
      console.error(err);
      setError(err);
      const fresh = await getCart().catch(() => []);
      setCart(fresh);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCart(prev => prev.filter(i => i.product_id !== productId));
      const updated = await removeCartItem(productId);
      setCart(updated);
    } catch (err) {
      console.error(err);
      setError(err);
      const fresh = await getCart().catch(() => []);
      setCart(fresh);
    }
  };

  const clearAll = async () => {
    try {
      setCart([]);
      await clearCart();
    } catch (err) {
      console.error(err);
      setError(err);
      const fresh = await getCart().catch(() => []);
      setCart(fresh);
    }
  };

  return <CartContext.Provider value={{cart , loading ,error , addToCart , setQuantity , removeFromCart , clearAll}}>{children}</CartContext.Provider>;
}


export const useCart = () => useContext(CartContext);
