import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" aria-label="Mundo Mascota, inicio">
          <span className="brand-icon">🐾</span>
          <span>
            <strong>Mundo</strong>
            <small>MASCOTA</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Inicio
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Productos
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link cart-nav active" : "nav-link cart-nav"}>
            🛒 Carrito <span className="cart-count">{totalItems}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
