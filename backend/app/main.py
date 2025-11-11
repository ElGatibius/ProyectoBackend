from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from pydantic import BaseModel  # Necesitas importar BaseModel

from . import models, schemas, crud, auth, gemini_service
from .database import SessionLocal, engine, get_db  # Importar get_db

app = FastAPI(title="AI Blog API", version="1.0.0")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "https://elgatibius.github.io",
        "https://elgatibius.github.io/ProyectoBackend",  # Reemplaza con tu usuario de GitHub
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definir GeneratePostRequest ANTES de usarlo
class GeneratePostRequest(BaseModel):
    prompt: str

# Dependencia para obtener el usuario actual desde el token JWT
async def get_current_user(
    authorization: Optional[str] = Header(None), 
    db: Session = Depends(get_db)
):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    
    token = authorization.split(" ")[1]
    email = auth.verify_token(token)
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Endpoints de autenticación
@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(user: schemas.UserCreate, db: Session = Depends(get_db)):
    authenticated_user = crud.authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint de prueba
@app.get("/")
def read_root():
    return {"message": "AI Blog API is running!"}

# Endpoint para generar posts con IA
@app.post("/generate-post", response_model=schemas.BlogPost)
def generate_post(
    request: GeneratePostRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Generar el contenido del post usando Gemini AI
    generated_content = gemini_service.generate_blog_post(request.prompt)
    
    # Crear el objeto BlogPostCreate con el contenido generado
    blog_post = schemas.BlogPostCreate(
        title=generated_content["title"],
        content=generated_content["content"],
        seo_keywords=generated_content["seo_keywords"]
    )
    
    # Guardar en la base de datos
    return crud.create_blog_post(db=db, post=blog_post, author_id=current_user.id)

# Endpoint público para obtener todos los posts
@app.get("/posts", response_model=List[schemas.BlogPost])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = crud.get_blog_posts(db, skip=skip, limit=limit)
    return posts

# Endpoint para obtener un post específico
@app.get("/posts/{post_id}", response_model=schemas.BlogPost)
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_blog_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post