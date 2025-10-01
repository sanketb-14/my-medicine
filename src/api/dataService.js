import { supabase } from "../../supabaseClient";

export async function getProducts() {
  const { data, error, status } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });



  if (error) {
  
    throw new Error(`Products fetch failed: ${error.message}`);
  }
  return data ?? [];
}


export async function getCart() {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, quantity')
    .order('id', { ascending: true });
  if (error) throw error;
  return data || [];
}