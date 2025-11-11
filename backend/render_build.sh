#!/bin/bash
# Script que se ejecutará en Render durante el despliegue

echo "Instalando dependencias..."
pip install -r requirements.txt

echo "Ejecutando script de creación de tablas..."
python -c "
from app.database import engine
from app.models import Base
print('Creando tablas...')
Base.metadata.create_all(bind=engine)
print('Tablas creadas exitosamente!')
"

echo "Despliegue completado!"