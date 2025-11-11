import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app.models import Base

def create_tables():
    print("Creando tablas en la base de datos...")
    try:
        Base.metadata.create_all(bind=engine)
        print("¡Tablas creadas exitosamente!")
    except Exception as e:
        print(f"Error creando tablas: {e}")
        raise

if __name__ == "__main__":
    create_tables()