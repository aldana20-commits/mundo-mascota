
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator


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
