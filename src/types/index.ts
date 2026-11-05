export type Category = "alimentos" | "accesorios" | "juguetes" | "higiene";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
