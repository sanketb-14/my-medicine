import { supabase } from "../../supabaseClient";

export async function getProducts(){
    const { data, error } = await supabase
.from('products')
.select('*')
.order('id', { ascending: true });
if (error) throw error;
return data;

}