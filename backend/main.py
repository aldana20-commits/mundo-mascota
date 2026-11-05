
from datetime import datetime
import json

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict, field_validator
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    func,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session


# --------------------------------------------------
# DATABASE
# --------------------------------------------------

DATABASE_URL = "sqlite:///./mundo_mascota.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    description = Column(Text, nullable=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    total = Column(Float, nullable=False)
    items_json = Column(Text, nullable=False)


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# PYDANTIC SCHEMAS
# --------------------------------------------------

class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    price: float
    stock: int
    description: str | None = None
    

class ProductCreate(BaseModel):
    name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    description: str | None = None

    @field_validator("name", "category")
    @classmethod
    def validate_text(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("Este campo no puede estar vacío")
        return value



class OrderItem(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    items: list[OrderItem] = Field(min_length=1)


class OrderOut(BaseModel):
    id: int
    created_at: datetime
    total: float
    items: list[dict]


# --------------------------------------------------
# INITIAL PRODUCTS
# --------------------------------------------------

INITIAL_PRODUCTS = [
    {
        "name": "Alimento balanceado para perros",
        "category": "alimentos",
        "price": 18500,
        "stock": 20,
        "description": "Alimento completo para perros adultos."
    },
    {
        "name": "Alimento balanceado para gatos",
        "category": "alimentos",
        "price": 16500,
        "stock": 20,
        "description": "Alimento completo para gatos adultos."
    },
    {
        "name": "Alimento para cachorros",
        "category": "alimentos",
        "price": 21000,
        "stock": 15,
        "description": "Alimento especial para cachorros."
    },
    {
        "name": "Alimento para gatitos",
        "category": "alimentos",
        "price": 19500,
        "stock": 15,
        "description": "Nutrición para gatitos en crecimiento."
    },
    {
        "name": "Correa para perros",
        "category": "accesorios",
        "price": 8500,
        "stock": 12,
        "description": "Correa resistente para paseos."
    },
    {
        "name": "Collar ajustable",
        "category": "accesorios",
        "price": 6500,
        "stock": 18,
        "description": "Collar cómodo y ajustable."
    },
    {
        "name": "Comedero para mascotas",
        "category": "accesorios",
        "price": 5500,
        "stock": 14,
        "description": "Comedero práctico y resistente."
    },
    {
        "name": "Cucha para mascotas",
        "category": "accesorios",
        "price": 32000,
        "stock": 5,
        "description": "Espacio cómodo para descansar."
    },
    {
        "name": "Shampoo para perros",
        "category": "higiene",
        "price": 7200,
        "stock": 10,
        "description": "Shampoo para el cuidado del pelaje."
    },
    {
        "name": "Piedras sanitarias para gatos",
        "category": "higiene",
        "price": 9000,
        "stock": 16,
        "description": "Piedras sanitarias absorbentes."
    },
    {
        "name": "Juguete mordillo",
        "category": "juguetes",
        "price": 4500,
        "stock": 20,
        "description": "Juguete resistente para perros."
    },
    {
        "name": "Pelota para mascotas",
        "category": "juguetes",
        "price": 3500,
        "stock": 25,
        "description": "Pelota para jugar y divertirse."
    },
]


def seed_products():
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            for item in INITIAL_PRODUCTS:
                db.add(Product(**item))
            db.commit()
    finally:
        db.close()


seed_products()


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="Mundo Mascota API",
    description="API para la tienda Mundo Mascota",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Bienvenido a la API de Mundo Mascota",
        "docs": "/docs"
    }


# --------------------------------------------------
# PRODUCTS ENDPOINTS
# --------------------------------------------------

@app.get("/api/products", response_model=list[ProductOut])
def get_products(
    category: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category:
        query = query.filter(
            func.lower(Product.category) == category.strip().lower()
        )

    return query.order_by(Product.id).all()


@app.get("/api/products/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    return product


# --------------------------------------------------
# ORDERS ENDPOINTS
# --------------------------------------------------

@app.post("/api/orders", response_model=OrderOut, status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    # Agrupar cantidades si un producto aparece más de una vez
    quantities = {}

    for item in order_data.items:
        quantities[item.product_id] = (
            quantities.get(item.product_id, 0) + item.quantity
        )

    order_items = []
    total = 0.0

    try:
        for product_id, quantity in quantities.items():

            product = db.query(Product).filter(
                Product.id == product_id
            ).with_for_update().first()

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"El producto {product_id} no existe"
                )

            if product.stock < quantity:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Stock insuficiente para {product.name}. "
                        f"Disponible: {product.stock}"
                    )
                )

            subtotal = round(product.price * quantity, 2)
            total += subtotal

            order_items.append({
                "product_id": product.id,
                "name": product.name,
                "quantity": quantity,
                "unit_price": product.price,
                "subtotal": subtotal
            })

            product.stock -= quantity

        new_order = Order(
            total=round(total, 2),
            items_json=json.dumps(
                order_items,
                ensure_ascii=False
            )
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        return {
            "id": new_order.id,
            "created_at": new_order.created_at,
            "total": new_order.total,
            "items": order_items
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No se pudo registrar el pedido"
        )


@app.get("/api/orders", response_model=list[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).all()

    return [
        {
            "id": order.id,
            "created_at": order.created_at,
            "total": order.total,
            "items": json.loads(order.items_json)
        }
        for order in orders
    ]


@app.post("/api/products", response_model=ProductOut, status_code=201)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):
    new_product = Product(**product_data.model_dump())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product
