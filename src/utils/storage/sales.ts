import { supabase } from "@/integrations/supabase/client";
import { Sale } from "@/types/inventory";

const STORAGE_KEY = 'nayra_sales';

export const saveSale = async (sale: Sale) => {
  const sales = await getSales();
  sales.push(sale);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  
  if (navigator.onLine) {
    try {
      const { error } = await supabase
        .from('sales')
        .insert([{
          product_id: sale.productId,
          quantity: Number(sale.quantity),
          amount: Number(sale.amount),
          type: sale.type,
          timestamp: sale.timestamp
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  }
  
  return sale;
};

export const getSales = async (): Promise<Sale[]> => {
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (!error && data) {
        const sales: Sale[] = data.map(s => ({
          id: s.id,
          productId: s.product_id || '',
          quantity: s.quantity,
          amount: s.amount,
          type: s.type as 'counter' | 'supply',
          timestamp: s.timestamp
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
        return sales;
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};