import { Product, Sale, DailySummary } from "@/types/inventory";
import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";

// Local Storage Keys
const STORAGE_KEYS = {
  PRODUCTS: 'nayra_products',
  SALES: 'nayra_sales',
  SUMMARIES: 'nayra_summaries',
  PENDING_SYNC: 'nayra_pending_sync'
};

// Products
export const saveProducts = async (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  
  if (navigator.onLine) {
    try {
      const { error } = await supabase.from('products').upsert(
        products.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          stock: Number(p.stock),
          unit: p.unit
        }))
      );
      if (error) throw error;
    } catch (error) {
      console.error('Error syncing products:', error);
    }
  }
};

export const getProducts = async (): Promise<Product[]> => {
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (!error && data) {
        const products = data.map(p => ({
          id: p.id,
          name: p.name,
          stock: p.stock,
          price: p.price,
          unit: p.unit
        }));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return products;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newProduct = {
    ...product,
    id: crypto.randomUUID()
  };
  
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          stock: Number(newProduct.stock),
          price: Number(newProduct.price),
          unit: newProduct.unit
        }])
        .select()
        .single();
      
      if (error) throw error;
      if (data) {
        const products = await getProducts();
        products.push(data as Product);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return data as Product;
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }
  
  const products = await getProducts();
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
};

export const removeProduct = async (id: string) => {
  if (navigator.onLine) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error removing product:', error);
    }
  }
  
  const products = await getProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  await saveProducts(updatedProducts);
};

// Sales
export const saveSale = async (sale: Sale) => {
  const sales = await getSales();
  sales.push(sale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  
  if (navigator.onLine) {
    await syncSale(sale);
  } else {
    const pendingSync = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SYNC) || '[]');
    pendingSync.push(sale);
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pendingSync));
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
        const sales = data.map(s => ({
          id: s.id,
          productId: s.product_id,
          quantity: s.quantity,
          amount: s.amount,
          type: s.type,
          timestamp: s.timestamp
        }));
        localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
        return sales;
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.SALES);
  return data ? JSON.parse(data) : [];
};

// Sync functions
export const syncSale = async (sale: Sale) => {
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
    
    if (!error) {
      const sales = await getSales();
      const updatedSales = sales.map(s => 
        s.id === sale.id ? { ...s, synced: true } : s
      );
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(updatedSales));
    }
  } catch (error) {
    console.error('Error syncing sale:', error);
  }
};

export const syncPendingSales = async () => {
  const pendingSync = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SYNC) || '[]');
  
  for (const sale of pendingSync) {
    await syncSale(sale);
  }
  
  localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, '[]');
};

// Daily Summaries
export const saveDailySummary = async (summary: DailySummary) => {
  const summaries = await getDailySummaries();
  summaries.push(summary);
  localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
  
  if (navigator.onLine) {
    try {
      await supabase
        .from('daily_summaries')
        .insert([{
          date: summary.date,
          total_sales: Number(summary.totalSales),
          counter_sales: Number(summary.counterSales),
          supply_sales: Number(summary.supplySales),
          products: summary.products
        }]);
    } catch (error) {
      console.error('Error saving daily summary:', error);
    }
  }
};

export const getDailySummaries = async (): Promise<DailySummary[]> => {
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('daily_summaries')
        .select('*')
        .order('date', { ascending: false });
      
      if (!error && data) {
        const summaries = data.map(d => ({
          date: d.date,
          totalSales: d.total_sales,
          counterSales: d.counter_sales,
          supplySales: d.supply_sales,
          products: d.products
        }));
        localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
        return summaries;
      }
    } catch (error) {
      console.error('Error fetching daily summaries:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
  return data ? JSON.parse(data) : [];
};

// Export functionality
export const exportToExcel = (summary: DailySummary) => {
  const wb = XLSX.utils.book_new();
  
  const salesData = [
    ['Date', summary.date],
    ['Total Sales', `₹${summary.totalSales}`],
    ['Counter Sales', `₹${summary.counterSales}`],
    ['Supply Sales', `₹${summary.supplySales}`],
    [],
    ['Product', 'Quantity Sold', 'Amount']
  ];
  
  summary.products.forEach(product => {
    salesData.push([product.name, product.quantity, `₹${product.amount}`]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(salesData);
  XLSX.utils.book_append_sheet(wb, ws, 'Daily Summary');
  
  XLSX.writeFile(wb, `sales-report-${summary.date}.xlsx`);
};

// Backup functionality
export const backupData = async () => {
  const backup = {
    products: await getProducts(),
    sales: await getSales(),
    summaries: await getDailySummaries(),
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('nayra_backup', JSON.stringify(backup));
  return backup;
};

export const restoreFromBackup = async () => {
  const backupData = localStorage.getItem('nayra_backup');
  if (!backupData) return false;
  
  const backup = JSON.parse(backupData);
  await saveProducts(backup.products);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(backup.sales));
  localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(backup.summaries));
  return true;
};