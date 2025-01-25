import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/inventory";
import { getProducts, saveProducts, addProduct, removeProduct } from "@/utils/storage";
import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { CategoryFilter } from "./CategoryFilter";

export function StockManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", stock: 0, price: 0, unit: "", category: "" });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const categories = [
    { id: "milk", name: "Milk Products" },
    { id: "curd", name: "Curd Products" },
    { id: "ice-cream", name: "Ice Cream" },
    { id: "dairy", name: "Other Dairy Products" },
  ];

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    const updated = products.map(product => {
      if (product.id === id) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setProducts(updated);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.unit || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    const product = addProduct(newProduct);
    setProducts([...products, product]);
    setNewProduct({ name: "", stock: 0, price: 0, unit: "", category: "" });
    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    });
  };

  const handleRemoveProduct = (id: string) => {
    removeProduct(id);
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Removed",
      description: "The product has been removed successfully.",
    });
  };

  const saveChanges = () => {
    saveProducts(products);
    toast({
      title: "Stock Updated",
      description: "The stock levels have been successfully updated.",
    });
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Stock Management</h2>
        <Button onClick={saveChanges}>Save Changes</Button>
      </div>

      <ProductForm
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <Card>
        <CardContent className="p-0">
          <ProductTable
            products={filteredProducts}
            updateProduct={updateProduct}
            handleRemoveProduct={handleRemoveProduct}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}