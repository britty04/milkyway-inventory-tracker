import { supabase } from "@/integrations/supabase/client";
import { Sale } from "@/types/inventory";

const STORAGE_KEY = 'nayra_sales';
const PENDING_SYNC_KEY = 'nayra_pending_sync';

export const saveSale = async (sale: Sale) => {
  const sales = await getSales();
  sales.push(sale);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  
  if (navigator.onLine) {
    await syncSale(sale);
  } else {
    const pendingSync = JSON.parse(localStorage.getItem(PENDING_SYNC_KEY) || '[]');
    pendingSync.push(sale);
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pendingSync));
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

export const syncSale = async (sale: Sale) => {
  try {
    const { error } = await supabase
      .from('sales')
      .insert([{
        id: sale.id,
        product_id: sale.productId,
        quantity: Number(sale.quantity),
        amount: Number(sale.amount),
        type: sale.type,
        timestamp: sale.timestamp
      }]);
    
    if (!error) {
      const sales = await getSales();
      const updatedSales = sales.map(s => 
        s.id === sale.id ? { ...s, synced: true } : s
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
    }
  } catch (error) {
    console.error('Error syncing sale:', error);
  }
};

export const syncPendingSales = async () => {
  const pendingSync = JSON.parse(localStorage.getItem(PENDING_SYNC_KEY) || '[]');
  
  for (const sale of pendingSync) {
    await syncSale(sale);
  }
  
  localStorage.setItem(PENDING_SYNC_KEY, '[]');
};