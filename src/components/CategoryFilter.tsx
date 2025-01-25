import { Button } from "@/components/ui/button";
import { Milk, IceCream, Package } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const categories = [
    { id: "all", name: "All Products", icon: null },
    { id: "milk", name: "Milk Products", icon: <Milk className="w-5 h-5" /> },
    { id: "curd", name: "Curd Products", icon: <Package className="w-5 h-5" /> },
    { id: "ice-cream", name: "Ice Cream", icon: <IceCream className="w-5 h-5" /> },
    { id: "dairy", name: "Other Dairy Products", icon: <Package className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => setSelectedCategory(category.id)}
          className="flex items-center gap-2"
        >
          {category.icon}
          {category.name}
        </Button>
      ))}
    </div>
  );
}