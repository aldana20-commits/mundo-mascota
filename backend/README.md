
# Mundo Mascota - Backend

API REST desarrollada con FastAPI, SQLite,
SQLAlchemy y Pydantic.

## Requisitos

- Python 3.10 o superior.
- pip.

## Instalación

Abrir una terminal dentro de la carpeta backend.

Crear entorno virtual:

```bash
python -m venv venv
```

Activar en Windows:

```bash
venv\Scripts\activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

## Ejecutar el servidor

```bash
uvicorn main:app --reload
```

Servidor:

http://127.0.0.1:8000

Documentación interactiva:

http://127.0.0.1:8000/docs

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/products | Listar productos |
| GET | /api/products?category=alimentos | Filtrar productos |
| GET | /api/products/{id} | Consultar producto |
| POST | /api/orders | Crear pedido |
| GET | /api/orders | Listar pedidos |

## Base de datos

Se utiliza SQLite y SQLAlchemy.

La base de datos se crea automáticamente
al iniciar la aplicación.

Las tablas son:

- products
- orders

Se cargan productos de ejemplo cuando la
base de datos está vacía.

## Pedidos

Al registrar un pedido:

- Se verifica que los productos existan.
- Se comprueba el stock disponible.
- Se calcula el total.
- Se descuenta el stock.
- Se guarda el pedido en SQLite.

## CORS

Se permite la conexión desde:

- http://localhost:5173
- http://127.0.0.1:5173
