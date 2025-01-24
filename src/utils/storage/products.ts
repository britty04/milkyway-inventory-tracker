import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/inventory";

const STORAGE_KEY = 'nayra_products';

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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        return products;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = async (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  
  if (navigator.onLine) {
    try {
      for (const product of products) {
        const { error } = await supabase
          .from('products')
          .upsert({
            id: product.id,
            name: product.name,
            stock: Number(product.stock),
            price: Number(product.price),
            unit: product.unit
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
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