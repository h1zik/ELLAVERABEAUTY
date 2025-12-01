from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
import base64
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'ellavera_jwt_secret_key')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION = int(os.environ.get('JWT_EXPIRATION_HOURS', '24'))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# AI Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============= AUTH MODELS =============
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    full_name: str
    is_admin: bool = False
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

# ============= PRODUCT MODELS =============
class ProductCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime

class ProductCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    slug: str
    category_id: str
    category_name: Optional[str] = None
    description: str
    benefits: Optional[str] = None
    key_ingredients: Optional[str] = None
    packaging_options: Optional[str] = None
    images: List[str] = []
    documents: List[dict] = []  # {name, url, type}
    featured: bool = False
    created_at: datetime
    updated_at: datetime

class ProductCreate(BaseModel):
    name: str
    category_id: str
    description: str
    benefits: Optional[str] = None
    key_ingredients: Optional[str] = None
    packaging_options: Optional[str] = None
    featured: bool = False

# ============= ARTICLE MODELS =============
class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    slug: str
    content: str
    excerpt: str
    cover_image: Optional[str] = None
    category: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    read_time: int = 5
    published: bool = False
    created_at: datetime
    updated_at: datetime

class ArticleCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    cover_image: Optional[str] = None
    category: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    read_time: int = 5
    published: bool = False

# ============= CLIENT MODELS =============
class Client(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    logo_url: str
    created_at: datetime

class ClientCreate(BaseModel):
    name: str
    logo_url: str

# ============= REVIEW MODELS =============
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    customer_name: str
    review_text: str
    rating: int = 5
    position: Optional[str] = None
    company: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: datetime

class ReviewCreate(BaseModel):
    customer_name: str
    review_text: str
    rating: int = 5
    position: Optional[str] = None
    company: Optional[str] = None
    photo_url: Optional[str] = None

# ============= THEME MODELS =============
class ThemeSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    primary_color: str = "#06b6d4"
    accent_color: str = "#0891b2"
    background_color: str = "#ffffff"
    text_color: str = "#0f172a"
    heading_font: str = "Playfair Display"
    body_font: str = "Inter"
    theme_mode: str = "light"
    updated_at: datetime

class ThemeSettingsUpdate(BaseModel):
    primary_color: Optional[str] = None
    accent_color: Optional[str] = None
    background_color: Optional[str] = None
    text_color: Optional[str] = None
    heading_font: Optional[str] = None
    body_font: Optional[str] = None
    theme_mode: Optional[str] = None

# ============= SITE SETTINGS MODELS =============
class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    site_name: str = "Ellavera Beauty"
    site_tagline: str = "Premium Cosmetic Manufacturing"
    logo_text: str = "Ellavera Beauty"
    footer_text: str = "Premium cosmetic manufacturing solutions for your brand."
    contact_email: str = "info@ellavera.com"
    contact_phone: str = "+62 123 456 7890"
    contact_address: str = "Jakarta, Indonesia"
    whatsapp_number: str = "6281234567890"
    whatsapp_message: str = "Hello Ellavera Beauty! I'm interested in your cosmetic manufacturing services."
    google_maps_url: str = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.65833061103!2d106.68942995!3d-6.229386599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
    facebook_url: str = "#"
    instagram_url: str = "#"
    twitter_url: str = "#"
    updated_at: datetime

class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    site_tagline: Optional[str] = None
    logo_url: Optional[str] = None
    logo_text: Optional[str] = None
    footer_text: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    whatsapp_number: Optional[str] = None
    whatsapp_message: Optional[str] = None
    google_maps_url: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None

# ============= CONTACT MODELS =============
class ContactLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    created_at: datetime

class ContactLeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str

# ============= PAGE SECTION MODELS =============
class PageSection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    page_name: str
    section_name: str
    section_type: str  # hero, features, timeline, testimonials, etc.
    content: dict
    order: int
    visible: bool = True
    created_at: datetime
    updated_at: datetime

class PageSectionCreate(BaseModel):
    page_name: str
    section_name: str
    section_type: str
    content: dict
    order: int
    visible: bool = True

# ============= AI MODELS =============
class AIContentGenerateRequest(BaseModel):
    prompt: str
    content_type: str  # product_description, article, benefits, etc.

class AIImageGenerateRequest(BaseModel):
    prompt: str

# ============= AUTH FUNCTIONS =============
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(token_data: dict = Depends(verify_token)) -> User:
    user = await db.users.find_one({"id": token_data.get("sub")}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    return User(**user)

async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ============= AUTH ROUTES =============
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = pwd_context.hash(user_data.password)
    
    user = {
        "id": user_id,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "password": hashed_password,
        "is_admin": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user)
    
    # Create token
    token = create_access_token({"sub": user_id})
    
    user.pop("password")
    user['created_at'] = datetime.fromisoformat(user['created_at'])
    return TokenResponse(access_token=token, user=User(**user))

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not pwd_context.verify(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": user["id"]})
    
    user.pop("password")
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    return TokenResponse(access_token=token, user=User(**user))

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ============= PRODUCT CATEGORY ROUTES =============
@api_router.get("/categories", response_model=List[ProductCategory])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
    for cat in categories:
        if isinstance(cat['created_at'], str):
            cat['created_at'] = datetime.fromisoformat(cat['created_at'])
    return categories

@api_router.post("/categories", response_model=ProductCategory)
async def create_category(category_data: ProductCategoryCreate, admin: User = Depends(require_admin)):
    category_id = str(uuid.uuid4())
    slug = category_data.name.lower().replace(" ", "-")
    
    category = {
        "id": category_id,
        "name": category_data.name,
        "slug": slug,
        "description": category_data.description,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.categories.insert_one(category)
    category['created_at'] = datetime.fromisoformat(category['created_at'])
    return ProductCategory(**category)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, admin: User = Depends(require_admin)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

# ============= PRODUCT ROUTES =============
@api_router.get("/products", response_model=List[Product])
async def get_products(category_id: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    if featured is not None:
        query["featured"] = featured
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    for prod in products:
        if isinstance(prod['created_at'], str):
            prod['created_at'] = datetime.fromisoformat(prod['created_at'])
        if isinstance(prod['updated_at'], str):
            prod['updated_at'] = datetime.fromisoformat(prod['updated_at'])
        
        # Add category name
        if prod.get('category_id'):
            category = await db.categories.find_one({"id": prod['category_id']}, {"_id": 0})
            prod['category_name'] = category['name'] if category else None
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if isinstance(product['created_at'], str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    if isinstance(product['updated_at'], str):
        product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    # Add category name
    if product.get('category_id'):
        category = await db.categories.find_one({"id": product['category_id']}, {"_id": 0})
        product['category_name'] = category['name'] if category else None
    
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, admin: User = Depends(require_admin)):
    product_id = str(uuid.uuid4())
    slug = product_data.name.lower().replace(" ", "-")
    
    product = {
        "id": product_id,
        "name": product_data.name,
        "slug": slug,
        "category_id": product_data.category_id,
        "description": product_data.description,
        "benefits": product_data.benefits,
        "key_ingredients": product_data.key_ingredients,
        "packaging_options": product_data.packaging_options,
        "images": [],
        "documents": [],
        "featured": product_data.featured,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.products.insert_one(product)
    product['created_at'] = datetime.fromisoformat(product['created_at'])
    product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    # Add category name
    category = await db.categories.find_one({"id": product['category_id']}, {"_id": 0})
    product['category_name'] = category['name'] if category else None
    
    return Product(**product)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductCreate, admin: User = Depends(require_admin)):
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    slug = product_data.name.lower().replace(" ", "-")
    update_data = {
        "name": product_data.name,
        "slug": slug,
        "category_id": product_data.category_id,
        "description": product_data.description,
        "benefits": product_data.benefits,
        "key_ingredients": product_data.key_ingredients,
        "packaging_options": product_data.packaging_options,
        "featured": product_data.featured,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(product['created_at'], str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    if isinstance(product['updated_at'], str):
        product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    # Add category name
    category = await db.categories.find_one({"id": product['category_id']}, {"_id": 0})
    product['category_name'] = category['name'] if category else None
    
    return Product(**product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin: User = Depends(require_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.post("/products/{product_id}/images")
async def add_product_image(product_id: str, image_url: str = Form(...), admin: User = Depends(require_admin)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    images = product.get('images', [])
    images.append(image_url)
    
    await db.products.update_one({"id": product_id}, {"$set": {"images": images}})
    return {"message": "Image added successfully", "images": images}

@api_router.post("/products/{product_id}/documents")
async def add_product_document(
    product_id: str,
    name: str = Form(...),
    url: str = Form(...),
    doc_type: str = Form(...),
    admin: User = Depends(require_admin)
):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    documents = product.get('documents', [])
    doc_id = str(uuid.uuid4())
    documents.append({
        "id": doc_id,
        "name": name,
        "url": url,
        "type": doc_type,
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    })
    
    await db.products.update_one({"id": product_id}, {"$set": {"documents": documents}})
    return {"message": "Document added successfully", "documents": documents}

@api_router.delete("/products/{product_id}/documents/{doc_id}")
async def delete_product_document(
    product_id: str,
    doc_id: str,
    admin: User = Depends(require_admin)
):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    documents = product.get('documents', [])
    documents = [doc for doc in documents if doc.get('id') != doc_id]
    
    await db.products.update_one({"id": product_id}, {"$set": {"documents": documents}})
    return {"message": "Document deleted successfully", "documents": documents}

@api_router.post("/upload-file")
async def upload_file(file: UploadFile = File(...), admin: User = Depends(require_admin)):
    """Upload file and return base64 data URL"""
    try:
        # Read file content
        contents = await file.read()
        
        # Convert to base64
        file_base64 = base64.b64encode(contents).decode('utf-8')
        
        # Get file extension
        file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else 'pdf'
        
        # Create data URL based on file type
        mime_types = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'txt': 'text/plain',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml'
        }
        
        mime_type = mime_types.get(file_ext, 'application/octet-stream')
        data_url = f"data:{mime_type};base64,{file_base64}"
        
        return {
            "success": True,
            "filename": file.filename,
            "data_url": data_url,
            "size": len(contents),
            "type": "image" if file_ext in ['png', 'jpg', 'jpeg', 'gif', 'webp'] else "document"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@api_router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), admin: User = Depends(require_admin)):
    """Upload image specifically and return base64 data URL"""
    try:
        # Validate file type
        file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        allowed_extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp']
        
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}")
        
        # Read file content
        contents = await file.read()
        
        # Check file size (max 2MB for images)
        if len(contents) > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size must be less than 2MB")
        
        # Convert to base64
        file_base64 = base64.b64encode(contents).decode('utf-8')
        
        # Create data URL
        mime_types = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'webp': 'image/webp'
        }
        
        mime_type = mime_types.get(file_ext, 'image/jpeg')
        data_url = f"data:{mime_type};base64,{file_base64}"
        
        return {
            "success": True,
            "filename": file.filename,
            "data_url": data_url,
            "size": len(contents)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

# ============= ARTICLE ROUTES =============
@api_router.get("/articles", response_model=List[Article])
async def get_articles(category: Optional[str] = None, published: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if published is not None:
        query["published"] = published
    
    articles = await db.articles.find(query, {"_id": 0}).to_list(1000)
    for article in articles:
        if isinstance(article['created_at'], str):
            article['created_at'] = datetime.fromisoformat(article['created_at'])
        if isinstance(article['updated_at'], str):
            article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    
    return articles

@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if isinstance(article['created_at'], str):
        article['created_at'] = datetime.fromisoformat(article['created_at'])
    if isinstance(article['updated_at'], str):
        article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    
    return Article(**article)

@api_router.post("/articles", response_model=Article)
async def create_article(article_data: ArticleCreate, admin: User = Depends(require_admin)):
    article_id = str(uuid.uuid4())
    slug = article_data.title.lower().replace(" ", "-")
    
    article = {
        "id": article_id,
        "title": article_data.title,
        "slug": slug,
        "content": article_data.content,
        "excerpt": article_data.excerpt,
        "cover_image": article_data.cover_image,
        "category": article_data.category,
        "meta_title": article_data.meta_title,
        "meta_description": article_data.meta_description,
        "read_time": article_data.read_time,
        "published": article_data.published,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.articles.insert_one(article)
    article['created_at'] = datetime.fromisoformat(article['created_at'])
    article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    return Article(**article)

@api_router.put("/articles/{article_id}", response_model=Article)
async def update_article(article_id: str, article_data: ArticleCreate, admin: User = Depends(require_admin)):
    existing = await db.articles.find_one({"id": article_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    
    slug = article_data.title.lower().replace(" ", "-")
    update_data = {
        "title": article_data.title,
        "slug": slug,
        "content": article_data.content,
        "excerpt": article_data.excerpt,
        "cover_image": article_data.cover_image,
        "category": article_data.category,
        "meta_title": article_data.meta_title,
        "meta_description": article_data.meta_description,
        "read_time": article_data.read_time,
        "published": article_data.published,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.articles.update_one({"id": article_id}, {"$set": update_data})
    
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if isinstance(article['created_at'], str):
        article['created_at'] = datetime.fromisoformat(article['created_at'])
    if isinstance(article['updated_at'], str):
        article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    
    return Article(**article)

@api_router.delete("/articles/{article_id}")
async def delete_article(article_id: str, admin: User = Depends(require_admin)):
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}

# ============= CLIENT ROUTES =============
@api_router.get("/clients", response_model=List[Client])
async def get_clients():
    clients = await db.clients.find({}, {"_id": 0}).to_list(1000)
    for client in clients:
        if isinstance(client['created_at'], str):
            client['created_at'] = datetime.fromisoformat(client['created_at'])
    return clients

@api_router.post("/clients", response_model=Client)
async def create_client(client_data: ClientCreate, admin: User = Depends(require_admin)):
    client_id = str(uuid.uuid4())
    
    client = {
        "id": client_id,
        "name": client_data.name,
        "logo_url": client_data.logo_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.clients.insert_one(client)
    client['created_at'] = datetime.fromisoformat(client['created_at'])
    return Client(**client)

@api_router.delete("/clients/{client_id}")
async def delete_client(client_id: str, admin: User = Depends(require_admin)):
    result = await db.clients.delete_one({"id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted successfully"}


# ============= REVIEW ROUTES =============
@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(1000)
    for review in reviews:
        if isinstance(review['created_at'], str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, admin: User = Depends(require_admin)):
    review_id = str(uuid.uuid4())
    
    review = {
        "id": review_id,
        "customer_name": review_data.customer_name,
        "review_text": review_data.review_text,
        "rating": review_data.rating,
        "position": review_data.position,
        "company": review_data.company,
        "photo_url": review_data.photo_url,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.reviews.insert_one(review)
    review['created_at'] = datetime.fromisoformat(review['created_at'])
    return Review(**review)

@api_router.put("/reviews/{review_id}", response_model=Review)
async def update_review(review_id: str, review_data: ReviewCreate, admin: User = Depends(require_admin)):
    existing = await db.reviews.find_one({"id": review_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found")
    
    update_data = {
        "customer_name": review_data.customer_name,
        "review_text": review_data.review_text,
        "rating": review_data.rating,
        "position": review_data.position,
        "company": review_data.company,
        "photo_url": review_data.photo_url
    }
    
    await db.reviews.update_one({"id": review_id}, {"$set": update_data})
    
    review = await db.reviews.find_one({"id": review_id}, {"_id": 0})
    if isinstance(review['created_at'], str):
        review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return Review(**review)

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, admin: User = Depends(require_admin)):
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}

# ============= THEME ROUTES =============
@api_router.get("/theme", response_model=ThemeSettings)
async def get_theme():
    theme = await db.theme_settings.find_one({}, {"_id": 0})
    if not theme:
        # Return default theme
        default_theme = {
            "primary_color": "#06b6d4",
            "accent_color": "#0891b2",
            "background_color": "#ffffff",
            "text_color": "#0f172a",
            "heading_font": "Playfair Display",
            "body_font": "Inter",
            "theme_mode": "light",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.theme_settings.insert_one(default_theme)
        theme = default_theme
    
    if isinstance(theme['updated_at'], str):
        theme['updated_at'] = datetime.fromisoformat(theme['updated_at'])
    
    return ThemeSettings(**theme)

@api_router.put("/theme", response_model=ThemeSettings)
async def update_theme(theme_data: ThemeSettingsUpdate, admin: User = Depends(require_admin)):
    update_fields = {k: v for k, v in theme_data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.theme_settings.update_one({}, {"$set": update_fields}, upsert=True)
    
    theme = await db.theme_settings.find_one({}, {"_id": 0})
    if isinstance(theme['updated_at'], str):
        theme['updated_at'] = datetime.fromisoformat(theme['updated_at'])
    
    return ThemeSettings(**theme)

# ============= CONTACT ROUTES =============
@api_router.post("/contact", response_model=ContactLead)
async def create_contact_lead(lead_data: ContactLeadCreate):
    lead_id = str(uuid.uuid4())
    
    lead = {
        "id": lead_id,
        "name": lead_data.name,
        "email": lead_data.email,
        "phone": lead_data.phone,
        "company": lead_data.company,
        "message": lead_data.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.contact_leads.insert_one(lead)
    lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return ContactLead(**lead)

@api_router.get("/contact/leads", response_model=List[ContactLead])
async def get_contact_leads(admin: User = Depends(require_admin)):
    leads = await db.contact_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead['created_at'], str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads

# ============= PAGE SECTION ROUTES =============
@api_router.get("/pages/{page_name}/sections", response_model=List[PageSection])
async def get_page_sections(page_name: str):
    sections = await db.page_sections.find({"page_name": page_name}, {"_id": 0}).sort("order", 1).to_list(1000)
    for section in sections:
        if isinstance(section['created_at'], str):
            section['created_at'] = datetime.fromisoformat(section['created_at'])
        if isinstance(section['updated_at'], str):
            section['updated_at'] = datetime.fromisoformat(section['updated_at'])
    return sections

@api_router.post("/pages/sections", response_model=PageSection)
async def create_page_section(section_data: PageSectionCreate, admin: User = Depends(require_admin)):
    section_id = str(uuid.uuid4())
    
    section = {
        "id": section_id,
        "page_name": section_data.page_name,
        "section_name": section_data.section_name,
        "section_type": section_data.section_type,
        "content": section_data.content,
        "order": section_data.order,
        "visible": section_data.visible,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.page_sections.insert_one(section)
    section['created_at'] = datetime.fromisoformat(section['created_at'])
    section['updated_at'] = datetime.fromisoformat(section['updated_at'])
    return PageSection(**section)

@api_router.put("/pages/sections/{section_id}", response_model=PageSection)
async def update_page_section(section_id: str, section_data: PageSectionCreate, admin: User = Depends(require_admin)):
    existing = await db.page_sections.find_one({"id": section_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Section not found")
    
    update_data = {
        "page_name": section_data.page_name,
        "section_name": section_data.section_name,
        "section_type": section_data.section_type,
        "content": section_data.content,
        "order": section_data.order,
        "visible": section_data.visible,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.page_sections.update_one({"id": section_id}, {"$set": update_data})
    
    section = await db.page_sections.find_one({"id": section_id}, {"_id": 0})
    if isinstance(section['created_at'], str):
        section['created_at'] = datetime.fromisoformat(section['created_at'])
    if isinstance(section['updated_at'], str):
        section['updated_at'] = datetime.fromisoformat(section['updated_at'])
    
    return PageSection(**section)

@api_router.delete("/pages/sections/{section_id}")
async def delete_page_section(section_id: str, admin: User = Depends(require_admin)):
    result = await db.page_sections.delete_one({"id": section_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    return {"message": "Section deleted successfully"}

# ============= SITE SETTINGS ROUTES =============
@api_router.get("/settings", response_model=SiteSettings)
async def get_settings():
    settings = await db.site_settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default settings
        default_settings = {
            "site_name": "Ellavera Beauty",
            "site_tagline": "Premium Cosmetic Manufacturing",
            "logo_text": "Ellavera Beauty",
            "footer_text": "Premium cosmetic manufacturing solutions for your brand. We create beauty products that inspire confidence.",
            "contact_email": "info@ellavera.com",
            "contact_phone": "+62 123 456 7890",
            "contact_address": "Jakarta, Indonesia",
            "whatsapp_number": "6281234567890",
            "whatsapp_message": "Hello Ellavera Beauty! I'm interested in your cosmetic manufacturing services.",
            "google_maps_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.65833061103!2d106.68942995!3d-6.229386599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
            "facebook_url": "#",
            "instagram_url": "#",
            "twitter_url": "#",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.site_settings.insert_one(default_settings)
        settings = default_settings
    
    if isinstance(settings['updated_at'], str):
        settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
    
    return SiteSettings(**settings)

@api_router.put("/settings", response_model=SiteSettings)
async def update_settings(settings_data: SiteSettingsUpdate, admin: User = Depends(require_admin)):
    update_fields = {k: v for k, v in settings_data.model_dump().items() if v is not None}
    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.site_settings.update_one({}, {"$set": update_fields}, upsert=True)
    
    settings = await db.site_settings.find_one({}, {"_id": 0})
    if isinstance(settings['updated_at'], str):
        settings['updated_at'] = datetime.fromisoformat(settings['updated_at'])
    
    return SiteSettings(**settings)

# ============= AI ROUTES =============
@api_router.post("/ai/generate-content")
async def generate_content(request: AIContentGenerateRequest, admin: User = Depends(require_admin)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=f"You are a professional cosmetic product copywriter. Generate {request.content_type} content that is elegant, premium, and compelling."
        ).with_model("openai", "gpt-5.1")
        
        user_message = UserMessage(text=request.prompt)
        response = await chat.send_message(user_message)
        
        return {"content": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@api_router.post("/ai/generate-image")
async def generate_image(request: AIImageGenerateRequest, admin: User = Depends(require_admin)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    try:
        image_gen = OpenAIImageGeneration(api_key=EMERGENT_LLM_KEY)
        images = await image_gen.generate_images(
            prompt=request.prompt,
            model="gpt-image-1",
            number_of_images=1
        )
        
        if images and len(images) > 0:
            image_base64 = base64.b64encode(images[0]).decode('utf-8')
            return {"image_base64": image_base64}
        else:
            raise HTTPException(status_code=500, detail="No image was generated")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()