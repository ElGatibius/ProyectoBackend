from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Esquemas para Usuario
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# Esquemas para BlogPost
class BlogPostBase(BaseModel):
    title: str
    content: str
    seo_keywords: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPost(BlogPostBase):
    id: int
    author_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Esquemas para Autenticación
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None