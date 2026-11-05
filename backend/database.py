
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Ubicación de la base de datos dentro de la carpeta backend
BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = f"sqlite:///{(BASE_DIR / 'mundo_mascota.db').as_posix()}"

# Conexión con SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Sesiones para trabajar con la base de datos
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para los modelos de SQLAlchemy
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
