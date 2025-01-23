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
  
  // If online, sync with Supabase
  if (navigator.onLine) {
    try {
      await supabase.from('products').upsert(
        products.map(p => ({
          ...p,
          price: Number(p.price),
          stock: Number(p.stock)
        }))
      );
    } catch (error) {
      console.error('Error syncing products:', error);
    }
  }
};

export const getProducts = async (): Promise<Product[]> => {
  // Try to get from Supabase first if online
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (!error && data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
        return data;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
  // Fallback to local storage
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    const defaultProducts: Product[] = [
      { id: '1', name: 'Milk', stock: 100, price: 30, unit: 'packet' },
      { id: '2', name: 'Curd', stock: 50, price: 25, unit: 'packet' },
      { id: '3', name: 'Buttermilk', stock: 30, price: 15, unit: 'bottle' }
    ];
    await saveProducts(defaultProducts);
    return defaultProducts;
  }
  return JSON.parse(data);
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const newProduct = {
    ...product,
    id: crypto.randomUUID()
  };
  
  const products = await getProducts();
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
};

export const removeProduct = async (id: string) => {
  const products = await getProducts();
  const updatedProducts = products.filter(product => product.id !== id);
  await saveProducts(updatedProducts);
  
  if (navigator.onLine) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

// Sales
export const saveSale = async (sale: Omit<Sale, 'id'>) => {
  const sales = await getSales();
  const newSale = {
    ...sale,
    id: crypto.randomUUID()
  };
  sales.push(newSale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  
  // If online, sync immediately
  if (navigator.onLine) {
    await syncSale(newSale);
  } else {
    // Add to pending sync queue
    const pendingSync = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SYNC) || '[]');
    pendingSync.push(newSale);
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pendingSync));
  }
  
  return newSale;
};

export const getSales = async (): Promise<Sale[]> => {
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (!error && data) {
        localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(data));
        return data;
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
    const { error } = await supabase.from('sales').insert([{
      ...sale,
      amount: Number(sale.amount),
      quantity: Number(sale.quantity)
    }]);
    
    if (!error) {
      // Update local sale as synced
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

// Add online/offline sync listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online, syncing pending sales...');
    syncPendingSales();
  });
}

// Daily Summaries
export const saveDailySummary = async (summary: DailySummary) => {
  const summaries = await getDailySummaries();
  summaries.push(summary);
  localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
  
  if (navigator.onLine) {
    try {
      await supabase.from('daily_summaries').insert([{
        ...summary,
        total_sales: Number(summary.totalSales),
        counter_sales: Number(summary.counterSales),
        supply_sales: Number(summary.supplySales)
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
        const formattedData = data.map(d => ({
          date: d.date,
          totalSales: d.total_sales,
          counterSales: d.counter_sales,
          supplySales: d.supply_sales,
          products: d.products
        }));
        localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(formattedData));
        return formattedData;
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