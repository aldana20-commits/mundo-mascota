import { useCart } from "../context/CartContext";
import type { CartItem as CartItemType } from "../types";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <article className="cart-item">
      <div className="cart-item-emoji">{item.product.image ?? "🛍️"}</div>
      <div className="cart-item-info">
        <h3>{item.product.name}</h3>
        <p>${item.product.price.toLocaleString("es-AR")} por unidad</p>
      </div>
      <div className="quantity-control">
        <button
          type="button"
          aria-label={`Restar una unidad de ${item.product.name}`}
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          aria-label={`Sumar una unidad de ${item.product.name}`}
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
        >
          +
        </button>
      </div>
      <strong className="cart-subtotal">
        ${(item.product.price * item.quantity).toLocaleString("es-AR")}
      </strong>
      <button
        className="remove-button"
        type="button"
        onClick={() => removeFromCart(item.product.id)}
      >
        Quitar
      </button>
    </article>
  );
}
