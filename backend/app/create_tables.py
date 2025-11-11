from .database import engine, Base
from .models import User, BlogPost

def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Tablas creadas exitosamente!")