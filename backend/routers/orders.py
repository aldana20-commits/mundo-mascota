
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Product, Order
from backend.schemas import OrderCreate, OrderOut


router = APIRouter()


@router.post("/api/orders", response_model=OrderOut, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        # Agrupar cantidades cuando un producto aparece más de una vez
        quantities = {}

        for item in order.items:
            quantities[item.product_id] = (
                quantities.get(item.product_id, 0) + item.quantity
            )

        order_items = []
        total = 0

        for product_id, quantity in quantities.items():
            product = (
                db.query(Product)
                .filter(Product.id == product_id)
                .with_for_update()
                .first()
            )

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

        total = round(total, 2)

        new_order = Order(
            total=total,
            items_json=json.dumps(order_items, ensure_ascii=False)
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


@router.get("/api/orders", response_model=list[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()

    return [
        {
            "id": order.id,
            "created_at": order.created_at,
            "total": order.total,
            "items": json.loads(order.items_json)
        }
        for order in orders
    ]
