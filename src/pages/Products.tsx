import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import type { Category } from "../types";

const categories: { value: string; label: string }[] = [
  { value: "todos", label: "Todas las categorías" },
  { value: "alimentos", label: "Alimentos" },
  { value: "accesorios", label: "Accesorios" },
  { value: "juguetes", label: "Juguetes" },
  { value: "higiene", label: "Higiene y cuidado" },
];

const validCategories: Category[] = ["alimentos", "accesorios", "juguetes", "higiene"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "todos";

  useEffect(() => {
    document.title = "Productos | Mundo Mascota";
  }, []);

  const filteredProducts = useMemo(() => {
    if (category === "todos" || !validCategories.includes(category as Category)) {
      return products;
    }
    return products.filter((product) => product.category === category);
  }, [category]);

  const handleCategoryChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === "todos") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", value);
    }
    setSearchParams(nextParams);
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">NUESTRO CATÁLOGO</span>
          <h1>Todos los productos</h1>
          <p>Elegí lo que más te guste y agregalo a tu carrito.</p>
        </div>
        <label className="filter-control">
          <span>Filtrar por categoría</span>
          <select value={category} onChange={(event) => handleCategoryChange(event.target.value)}>
            {categories.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="results-count">
        {filteredProducts.length} {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
      </p>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>🔎</span>
          <h2>No encontramos productos</h2>
          <p>Probá seleccionando otra categoría.</p>
        </div>
      )}
    </section>
  );
}
