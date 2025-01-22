import { Product, Sale, DailySummary } from "@/types/inventory";
import * as XLSX from 'xlsx';

const STORAGE_KEYS = {
  PRODUCTS: 'nayra_products',
  SALES: 'nayra_sales',
  SUMMARIES: 'nayra_summaries'
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    // Initialize with default products if none exist
    const defaultProducts: Product[] = [
      { id: '1', name: 'Milk', stock: 100, price: 30, unit: 'packet' },
      { id: '2', name: 'Curd', stock: 50, price: 25, unit: 'packet' },
      { id: '3', name: 'Buttermilk', stock: 30, price: 15, unit: 'bottle' }
    ];
    saveProducts(defaultProducts);
    return defaultProducts;
  }
  return JSON.parse(data);
};

export const addProduct = (product: Omit<Product, 'id'>) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString() // Convert timestamp to string
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const removeProduct = (id: string) => {
  const products = getProducts();
  const updatedProducts = products.filter(product => product.id !== id);
  saveProducts(updatedProducts);
};

export const saveSale = (sale: Sale) => {
  const sales = getSales();
  const newSale = {
    ...sale,
    id: Date.now().toString() // Convert timestamp to string
  };
  sales.push(newSale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  return newSale;
};

export const getSales = (): Sale[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SALES);
  return data ? JSON.parse(data) : [];
};

export const saveDailySummary = (summary: DailySummary) => {
  const summaries = getDailySummaries();
  summaries.push(summary);
  localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
};

export const getDailySummaries = (): DailySummary[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
  return data ? JSON.parse(data) : [];
};

export const exportToExcel = (summary: DailySummary) => {
  const wb = XLSX.utils.book_new();
  
  // Create sales worksheet
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
  
  // Save the file
  XLSX.writeFile(wb, `sales-report-${summary.date}.xlsx`);
};

// Add backup functionality
export const backupData = () => {
  const backup = {
    products: getProducts(),
    sales: getSales(),
    summaries: getDailySummaries(),
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('nayra_backup', JSON.stringify(backup));
  return backup;
};

export const restoreFromBackup = () => {
  const backupData = localStorage.getItem('nayra_backup');
  if (!backupData) return false;
  
  const backup = JSON.parse(backupData);
  saveProducts(backup.products);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(backup.sales));
  localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(backup.summaries));
  return true;
};