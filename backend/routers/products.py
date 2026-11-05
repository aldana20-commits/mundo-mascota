
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Product
from backend.schemas import ProductOut, ProductCreate


router = APIRouter()


@router.get("/api/products", response_model=list[ProductOut])
def get_products(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Product)

    if category:
        query = query.filter(Product.category == category.lower())

    return query.order_by(Product.id).all()


@router.get("/api/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    return product


@router.post("/api/products", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**product.model_dump())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product
