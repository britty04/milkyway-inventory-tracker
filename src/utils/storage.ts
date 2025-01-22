import { Product, Sale, DailySummary } from "@/types/inventory";
import * as XLSX from 'xlsx';

const STORAGE_KEYS = {
  PRODUCTS: 'arokya_products',
  SALES: 'arokya_sales',
  SUMMARIES: 'arokya_summaries'
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
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
  
  // Create sales worksheet
  const salesData = [
    ['Date', summary.date],
    ['Total Sales', `₹${summary.totalSales.toString()}`],
    ['Counter Sales', `₹${summary.counterSales.toString()}`],
    ['Supply Sales', `₹${summary.supplySales.toString()}`],
    [],
    ['Product', 'Quantity Sold', 'Amount']
  ];
  
  summary.products.forEach(product => {
    salesData.push([product.name, product.quantity, `₹${product.amount.toString()}`]);
  });
  
  const ws = XLSX.utils.aoa_to_sheet(salesData);
  XLSX.utils.book_append_sheet(wb, ws, 'Daily Summary');
  
  // Save the file
  XLSX.writeFile(wb, `sales-report-${summary.date}.xlsx`);
};