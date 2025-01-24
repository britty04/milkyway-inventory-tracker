import { supabase } from "@/integrations/supabase/client";
import { DailySummary } from "@/types/inventory";

const STORAGE_KEY = 'nayra_summaries';

export const saveDailySummary = async (summary: DailySummary) => {
  const summaries = await getDailySummaries();
  summaries.push(summary);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(summaries));
  
  if (navigator.onLine) {
    try {
      const { error } = await supabase
        .from('daily_summaries')
        .insert([{
          date: summary.date,
          total_sales: Number(summary.totalSales),
          counter_sales: Number(summary.counterSales),
          supply_sales: Number(summary.supplySales),
          products: summary.products
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving summary:', error);
    }
  }
  
  return summary;
};

export const getDailySummaries = async (): Promise<DailySummary[]> => {
  if (navigator.onLine) {
    try {
      const { data, error } = await supabase
        .from('daily_summaries')
        .select('*')
        .order('date', { ascending: false });
      
      if (!error && data) {
        const summaries: DailySummary[] = data.map(s => ({
          date: s.date,
          totalSales: s.total_sales,
          counterSales: s.counter_sales,
          supplySales: s.supply_sales,
          products: s.products as { name: string; quantity: number; amount: number; }[]
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(summaries));
        return summaries;
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};