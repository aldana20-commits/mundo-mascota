import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const categoryTiles = [
  { label: "Alimentos", detail: "Nutrición para perros y gatos", emoji: "🥣", value: "alimentos" },
  { label: "Accesorios", detail: "Todo para su comodidad", emoji: "🦮", value: "accesorios" },
  { label: "Juguetes", detail: "Diversión todos los días", emoji: "🎾", value: "juguetes" },
  { label: "Higiene", detail: "Cuidado y bienestar", emoji: "🧴", value: "higiene" },
];

export default function Home() {
  const dogFood = products.filter((product) => product.id >= 1 && product.id <= 10);
  const catFood = products.filter((product) => product.id >= 11 && product.id <= 20);

  return (
    <div className="home-page">
      <Link to="/products" className="home-banner" aria-label="Ver todos los productos de Mundo Mascota">
        <img src="/images/mundo-mascota-hero.png" alt="Perro y gato descansando juntos. Mundo Mascota: todo lo que tu mascota necesita." />
      </Link>

      <section className="home-categories">
        <div className="home-section-title">
          <span className="eyebrow">ENCONTRÁ LO QUE BUSCÁS</span>
          <h2>Explorá nuestras categorías 🐾</h2>
        </div>
        <div className="category-tiles">
          {categoryTiles.map((category) => (
            <Link className="category-tile" to={`/products?category=${category.value}`} key={category.value}>
              <span className="category-emoji">{category.emoji}</span>
              <span><strong>{category.label}</strong><small>{category.detail}</small></span>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-product-section">
        <div className="home-row-heading">
          <h2>🐾 Alimentos para perros</h2>
          <Link to="/products?category=alimentos">Ver todos →</Link>
        </div>
        <div className="products-grid home-products-grid">
          {dogFood.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="home-product-section">
        <div className="home-row-heading">
          <h2>🐾 Alimentos para gatos</h2>
          <Link to="/products?category=alimentos">Ver todos →</Link>
        </div>
        <div className="products-grid home-products-grid">
          {catFood.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="home-callout">
        <span>❤️</span>
        <div><h2>Ellos se merecen lo mejor</h2><p>Encontrá todo lo que necesitan en un solo lugar.</p></div>
        <Link to="/products" className="button">Ver catálogo completo →</Link>
      </section>
    </div>
  );
}
