import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<Product["category"], string> = {
  alimentos: "Alimentos",
  accesorios: "Accesorios",
  juguetes: "Juguetes",
  higiene: "Higiene y cuidado",
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image" aria-label={`Ver ${product.name}`}>
        <span>{product.image ?? "🛍️"}</span>
      </Link>
      <div className="product-info">
        <span className="category-tag">{categoryLabels[product.category]}</span>
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-description">{product.description}</p>
        <div className="product-card-bottom">
          <strong className="price">${product.price.toLocaleString("es-AR")}</strong>
          <button
            className="button button-small"
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Sin stock" : "+ Agregar"}
          </button>
        </div>
        <small className="stock-label">Stock: {product.stock}</small>
      </div>
    </article>
  );
}
