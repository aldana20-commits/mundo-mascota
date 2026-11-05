import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

const categoryLabels: Record<string, string> = {
  alimentos: "Alimentos",
  accesorios: "Accesorios",
  juguetes: "Juguetes",
  higiene: "Higiene y cuidado",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === Number(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    document.title = product ? `${product.name} | Mundo Mascota` : "Producto no encontrado";
  }, [product]);

  if (!product) {
    return (
      <section className="empty-state detail-not-found">
        <span>🛍️</span>
        <h1>Producto no encontrado</h1>
        <p>El producto que buscás no existe o ya no está disponible.</p>
        <Link to="/products" className="button">Volver al catálogo</Link>
      </section>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedMessage("¡Producto agregado al carrito!");
    window.setTimeout(() => setAddedMessage(""), 2500);
  };

  return (
    <section className="detail-section">
      <Link to="/products" className="back-link">← Volver al catálogo</Link>
      <div className="detail-card">
        <div className="detail-image"><span>{product.image ?? "🛍️"}</span></div>
        <div className="detail-info">
          <span className="category-tag">{categoryLabels[product.category]}</span>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <strong className="detail-price">${product.price.toLocaleString("es-AR")}</strong>
          <p className="detail-stock">Disponibles: {product.stock} unidades</p>
          <div className="detail-actions">
            <label className="quantity-input">
              Cantidad
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setQuantity(Math.min(product.stock, Math.max(1, value || 1)));
                }}
              />
            </label>
            <button
              className="button"
              type="button"
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              Agregar al carrito
            </button>
          </div>
          {addedMessage && <p className="success-message" role="status">{addedMessage}</p>}
        </div>
      </div>
    </section>
  );
}
