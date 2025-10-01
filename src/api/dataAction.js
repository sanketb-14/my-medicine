import { supabase } from "../../supabaseClient";
import { getCart } from "./dataService";

export async function addOrUpdateCartItem(productId, qty = 1) {
  const { data: existing, error: selErr } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("product_id", productId)
    .limit(1)
    .maybeSingle();
  if (selErr) throw selErr;

  if (existing) {
    const newQty = existing.quantity + qty;
    if (newQty <= 0) {
      await supabase.from("cart_items").delete().eq("id", existing.id);
    } else {
      await supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", existing.id);
    }
  } else {
    await supabase
      .from("cart_items")
      .insert([{ product_id: productId, quantity: qty }]);
  }
  return getCart();
}

export async function setCartItemQuantity(productId, quantity) {
  if (quantity <= 0) {
    await supabase.from('cart_items').delete().eq('product_id', productId);
  } else {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id')
      .eq('product_id', productId)
      .limit(1)
      .maybeSingle();
    if (existing) {
      await supabase.from('cart_items').update({ quantity }).eq('product_id', productId);
    } else {
      await supabase.from('cart_items').insert([{ product_id: productId, quantity }]);
    }
  }
  return getCart();
}

export async function removeCartItem(productId) {
  await supabase.from('cart_items').delete().eq('product_id', productId);
  return getCart();
}

export async function clearCart() {
  await supabase.from('cart_items').delete().neq('id', 0);
  return [];
}
