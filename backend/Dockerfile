FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación (incluyendo create_tables.py)
COPY . .

# Verificar que los archivos se copiaron correctamente
RUN ls -la

# Crear tablas al construir la imagen
RUN python create_tables.py

# Exponer el puerto
EXPOSE 10000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]