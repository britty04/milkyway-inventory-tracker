import { getProducts } from './products';
import { getSales } from './sales';
import { getDailySummaries } from './summaries';

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
  localStorage.setItem('nayra_products', JSON.stringify(backup.products));
  localStorage.setItem('nayra_sales', JSON.stringify(backup.sales));
  localStorage.setItem('nayra_summaries', JSON.stringify(backup.summaries));
  return true;
};