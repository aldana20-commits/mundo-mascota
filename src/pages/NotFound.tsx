import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="empty-state not-found">
      <span>🚧</span>
      <strong className="error-code">404</strong>
      <h1>¡Ups! Página no encontrada</h1>
      <p>La dirección que ingresaste no existe.</p>
      <Link to="/" className="button">Volver al inicio</Link>
    </section>
  );
}
