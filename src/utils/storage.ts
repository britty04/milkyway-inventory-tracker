import { Product, Sale, DailySummary } from "@/types/inventory";
import * as XLSX from 'xlsx';

const STORAGE_KEYS = {
  PRODUCTS: 'nayra_products',
  SALES: 'nayra_sales',
  SUMMARIES: 'nayra_summaries'
};

const DEFAULT_PRODUCTS: Product[] = [
  // Milk Products
  { id: 'milk-1', name: 'FCM 1500 ML', stock: 0, price: 120, unit: 'bottle', category: 'milk' },
  { id: 'milk-2', name: 'FCM 1000 ML', stock: 0, price: 69, unit: 'packet', category: 'milk' },
  { id: 'milk-3', name: 'FCM 500 ML', stock: 0, price: 37, unit: 'packet', category: 'milk' },
  { id: 'milk-4', name: 'FCM 200 ML', stock: 0, price: 15, unit: 'packet', category: 'milk' },
  { id: 'milk-5', name: 'FCM 130 ML', stock: 0, price: 10, unit: 'packet', category: 'milk' },

  // Curd Products
  { id: 'curd-1', name: 'A. CURD 110 GM POUCH', stock: 0, price: 10, unit: 'pouch', category: 'curd' },
  { id: 'curd-2', name: 'A. CURD 400 GM POUCH', stock: 0, price: 30, unit: 'pouch', category: 'curd' },
  { id: 'curd-3', name: 'A. CURD 85 CUP', stock: 0, price: 10, unit: 'cup', category: 'curd' },
  { id: 'curd-4', name: 'A. CURD 200 GM CUP', stock: 0, price: 25, unit: 'cup', category: 'curd' },
  { id: 'curd-5', name: 'H. CURD 500 GM POUCH', stock: 0, price: 38, unit: 'pouch', category: 'curd' },
  { id: 'curd-6', name: 'H. CURD 85 GM CUP', stock: 0, price: 10, unit: 'cup', category: 'curd' },
  { id: 'curd-7', name: 'H. CURD 200 GM CUP', stock: 0, price: 25, unit: 'cup', category: 'curd' },
  { id: 'curd-8', name: 'H. CURD 1 KG CUP', stock: 0, price: 120, unit: 'cup', category: 'curd' },
  { id: 'curd-9', name: 'H. SWEET CURD 100GM', stock: 0, price: 10, unit: 'cup', category: 'curd' },

  // Buttermilk and Lassi
  { id: 'drink-1', name: 'H. BUTTER MILK', stock: 0, price: 10, unit: 'packet', category: 'dairy' },
  { id: 'drink-2', name: 'JEERA BUTTER MILK', stock: 0, price: 10, unit: 'packet', category: 'dairy' },
  { id: 'drink-3', name: 'HATSUN LASSI 140ML', stock: 0, price: 20, unit: 'cup', category: 'dairy' },
  { id: 'drink-4', name: 'HATSUN YOGURT 175 ML', stock: 0, price: 25, unit: 'cup', category: 'dairy' },
  { id: 'drink-5', name: 'ANIVA 140 ML', stock: 0, price: 10, unit: 'cup', category: 'dairy' },

  // Ice Sticks
  { id: 'stick-1', name: 'ICE STICK RS. 10', stock: 0, price: 10, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-2', name: 'ICE STICK RS. 15', stock: 0, price: 15, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-3', name: 'ICE STICK RS. 25', stock: 0, price: 25, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-4', name: 'ICE STICK RS. 30', stock: 0, price: 30, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-5', name: 'ICE STICK RS. 35', stock: 0, price: 35, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-6', name: 'ICE STICK RS. 40', stock: 0, price: 40, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-7', name: 'ICE STICK RS. 45', stock: 0, price: 45, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-8', name: 'ICE STICK RS. 50', stock: 0, price: 50, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-9', name: 'ICE STICK RS. 55', stock: 0, price: 55, unit: 'piece', category: 'ice-cream' },
  { id: 'stick-10', name: 'ICE STICK RS. 70', stock: 0, price: 70, unit: 'piece', category: 'ice-cream' },

  // Ice Cups
  { id: 'cup-1', name: 'ICE CUP RS. 6', stock: 0, price: 6, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-2', name: 'ICE CUP RS. 10', stock: 0, price: 10, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-3', name: 'ICE CUP RS. 15', stock: 0, price: 15, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-4', name: 'ICE CUP RS. 20', stock: 0, price: 20, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-5', name: 'ICE CUP RS. 30', stock: 0, price: 30, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-6', name: 'ICE CUP RS. 35', stock: 0, price: 35, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-7', name: 'ICE CUP RS. 40', stock: 0, price: 40, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-8', name: 'ICE CUP RS. 45', stock: 0, price: 45, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-9', name: 'ICE CUP RS. 50', stock: 0, price: 50, unit: 'cup', category: 'ice-cream' },
  { id: 'cup-10', name: 'ICE CUP RS. 55', stock: 0, price: 55, unit: 'cup', category: 'ice-cream' },

  // Ice Cones and Special Items
  { id: 'cone-1', name: 'ICE CONE RS. 35', stock: 0, price: 35, unit: 'piece', category: 'ice-cream' },
  { id: 'cone-2', name: 'ICE CONE RS. 55', stock: 0, price: 55, unit: 'piece', category: 'ice-cream' },
  { id: 'special-1', name: 'ICE BALL', stock: 0, price: 45, unit: 'piece', category: 'ice-cream' },
  { id: 'special-2', name: 'CASATA SLICE', stock: 0, price: 70, unit: 'piece', category: 'ice-cream' },
  { id: 'special-3', name: 'CAKE SLICE', stock: 0, price: 70, unit: 'piece', category: 'ice-cream' },

  // Ice Bites
  { id: 'bites-1', name: 'BITES RS.5', stock: 0, price: 5, unit: 'piece', category: 'ice-cream' },
  { id: 'bites-2', name: 'BITES RS.10', stock: 0, price: 10, unit: 'piece', category: 'ice-cream' },
  { id: 'bites-3', name: 'BITES SANWITCH RS.15', stock: 0, price: 15, unit: 'piece', category: 'ice-cream' },
  { id: 'bites-4', name: 'BITES SANWITCH RS.25', stock: 0, price: 25, unit: 'piece', category: 'ice-cream' },

  // Family Packs
  { id: 'fmp-1', name: 'FMP RS. 160', stock: 0, price: 160, unit: 'pack', category: 'ice-cream' },
  { id: 'fmp-2', name: 'FMP RS. 200', stock: 0, price: 200, unit: 'pack', category: 'ice-cream' },
  { id: 'fmp-3', name: 'FMP RS. 280', stock: 0, price: 280, unit: 'pack', category: 'ice-cream' },
  { id: 'fmp-4', name: 'FMP RS. 300', stock: 0, price: 300, unit: 'pack', category: 'ice-cream' },
  { id: 'fmp-5', name: 'FMP RS. 320', stock: 0, price: 320, unit: 'pack', category: 'ice-cream' },
  { id: 'fmp-6', name: 'FMP RS. 340', stock: 0, price: 340, unit: 'pack', category: 'ice-cream' },

  // Cheese and Paneer Products
  { id: 'cheese-1', name: 'CHEESE SPREAD 50 GM', stock: 0, price: 20, unit: 'pack', category: 'dairy' },
  { id: 'cheese-2', name: 'CHEESE SPREAD 100 GM', stock: 0, price: 40, unit: 'pack', category: 'dairy' },
  { id: 'paneer-1', name: 'HATSUN RIPENED TB 100GM', stock: 0, price: 60, unit: 'pack', category: 'dairy' },
  { id: 'paneer-2', name: 'HATSUN RIPENED TB CHIPLET 10GM', stock: 0, price: 64, unit: 'pack', category: 'dairy' },
  { id: 'paneer-3', name: 'HATSUN RIPENED TB CHIPLET 20GM', stock: 0, price: 130, unit: 'pack', category: 'dairy' },

  // Butter Products
  { id: 'butter-1', name: 'H. COOKING BUTTER 100 GM', stock: 0, price: 60, unit: 'pack', category: 'dairy' },
  { id: 'butter-2', name: 'H. COOKING BUTTER 200 GM', stock: 0, price: 300, unit: 'pack', category: 'dairy' },
  { id: 'butter-3', name: 'H. COOKING BUTTER 500 GM', stock: 0, price: 300, unit: 'pack', category: 'dairy' }
];

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(data);
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const addProduct = (product: Omit<Product, 'id'>) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString()
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
  sales.push(sale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
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