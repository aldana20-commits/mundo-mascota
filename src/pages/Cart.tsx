import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [message, setMessage] = useState("");

  const handleCheckout = () => {
    if (items.length === 0) return;
    clearCart();
    setMessage("¡Tu pedido fue realizado correctamente! Gracias por comprar en Mundo Mascota.");
  };

  const handleClear = () => {
    clearCart();
    setMessage("");
  };

  return (
    <section className="page-section cart-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">TU COMPRA</span>
          <h1>Mi carrito</h1>
          <p>Revisá tus productos antes de finalizar el pedido.</p>
        </div>
      </div>

      {message && <div className="success-banner" role="status">✓ {message}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <span>🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>¡Todavía estás a tiempo de elegir algo rico!</p>
          <Link to="/products" className="button">Explorar productos</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => <CartItem key={item.product.id} item={item} />)}
          </div>
          <div className="cart-summary">
            <div>
              <span>{totalItems} {totalItems === 1 ? "unidad" : "unidades"}</span>
              <h2>Total: ${totalPrice.toLocaleString("es-AR")}</h2>
            </div>
            <div className="cart-actions">
              <button className="button button-outline" type="button" onClick={handleClear}>
                Vaciar carrito
              </button>
              <button className="button" type="button" onClick={handleCheckout}>
                Finalizar pedido
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
