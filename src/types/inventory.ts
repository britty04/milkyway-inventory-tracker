export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  unit: string;
  category: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  amount: number;
  type: 'counter' | 'supply';
  timestamp: string;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  counterSales: number;
  supplySales: number;
  products: {
    name: string;
    quantity: number;
    amount: number;
  }[];
}