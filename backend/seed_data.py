import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from datetime import datetime, timezone
import uuid

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client['ellavera_beauty']

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_data():
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.categories.delete_many({})
    await db.products.delete_many({})
    await db.articles.delete_many({})
    await db.clients.delete_many({})
    await db.theme_settings.delete_many({})
    
    # Create admin user
    admin = {
        "id": str(uuid.uuid4()),
        "email": "admin@ellavera.com",
        "full_name": "Admin User",
        "password": pwd_context.hash("admin123"),
        "is_admin": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin)
    print("✅ Admin user created (email: admin@ellavera.com, password: admin123)")
    
    # Create categories
    categories = [
        {"id": str(uuid.uuid4()), "name": "Skincare", "slug": "skincare", "description": "Premium skincare products", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Body Care", "slug": "body-care", "description": "Luxurious body care solutions", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Hair Care", "slug": "hair-care", "description": "Professional hair care products", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "name": "Fragrance", "slug": "fragrance", "description": "Signature fragrances", "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    await db.categories.insert_many(categories)
    print(f"✅ Created {len(categories)} categories")
    
    # Create sample products
    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Hydrating Face Serum",
            "slug": "hydrating-face-serum",
            "category_id": categories[0]["id"],
            "description": "A luxurious, lightweight serum that deeply hydrates and revitalizes your skin. Formulated with premium ingredients for a radiant complexion.",
            "benefits": "Deeply hydrates, reduces fine lines, improves skin texture, and provides a natural glow. Suitable for all skin types.",
            "key_ingredients": "Hyaluronic Acid, Vitamin C, Niacinamide, Peptides, Natural botanical extracts",
            "packaging_options": "Available in 30ml, 50ml, and 100ml bottles with premium glass packaging",
            "images": ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"],
            "documents": [],
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Nourishing Body Lotion",
            "slug": "nourishing-body-lotion",
            "category_id": categories[1]["id"],
            "description": "Rich, creamy body lotion that provides long-lasting moisture and leaves your skin feeling silky smooth.",
            "benefits": "24-hour hydration, fast-absorbing, non-greasy formula, enriched with natural oils",
            "key_ingredients": "Shea Butter, Coconut Oil, Vitamin E, Aloe Vera, Essential Oils",
            "packaging_options": "200ml pump bottle, 400ml tube, 1L refill pouch",
            "images": ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800"],
            "documents": [],
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Revitalizing Shampoo",
            "slug": "revitalizing-shampoo",
            "category_id": categories[2]["id"],
            "description": "Professional-grade shampoo that cleanses, strengthens, and adds shine to your hair.",
            "benefits": "Gentle cleansing, strengthens hair, adds volume, suitable for daily use",
            "key_ingredients": "Keratin, Argan Oil, Biotin, Panthenol, Natural plant extracts",
            "packaging_options": "250ml, 500ml, 1L bottles with pump or flip-top cap",
            "images": ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800"],
            "documents": [],
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.products.insert_many(products)
    print(f"✅ Created {len(products)} sample products")
    
    # Create sample articles
    articles = [
        {
            "id": str(uuid.uuid4()),
            "title": "The Future of Clean Beauty: Trends in 2025",
            "slug": "future-of-clean-beauty-2025",
            "content": "The beauty industry is experiencing a transformative shift towards clean, sustainable, and transparent formulations. As consumers become more conscious of what they put on their skin, brands are responding with innovative solutions that prioritize both efficacy and environmental responsibility.\n\nKey trends shaping the industry include:\n\n1. Biotechnology in Beauty: Lab-grown ingredients that are more sustainable and effective than traditional sources.\n\n2. Waterless Formulations: Concentrated products that reduce water waste and packaging needs.\n\n3. Microbiome-Friendly Products: Formulations that support the skin's natural ecosystem.\n\n4. Zero-Waste Packaging: Refillable, recyclable, and biodegradable packaging solutions.\n\n5. Personalized Skincare: AI-powered formulations tailored to individual skin needs.\n\nAt Ellavera Beauty, we're committed to staying ahead of these trends while maintaining our high standards for quality and safety. We work closely with brands to develop products that meet the demands of modern consumers while respecting our planet.",
            "excerpt": "Discover the key trends shaping the clean beauty industry in 2025 and how they're transforming cosmetic manufacturing.",
            "cover_image": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200",
            "category": "Industry Trends",
            "meta_title": "Future of Clean Beauty 2025 | Ellavera Beauty",
            "meta_description": "Explore the latest trends in clean beauty manufacturing and sustainable cosmetics for 2025.",
            "read_time": 5,
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.articles.insert_many(articles)
    print(f"✅ Created {len(articles)} sample articles")
    
    # Create sample clients
    clients = [
        {
            "id": str(uuid.uuid4()),
            "name": "Luminara Beauty",
            "logo_url": "https://via.placeholder.com/200x80/06b6d4/ffffff?text=Luminara",
            "testimonial": "Ellavera Beauty transformed our product line. Their expertise in formulation and commitment to quality exceeded our expectations.",
            "position": "CEO, Luminara Beauty",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serene Skin Co",
            "logo_url": "https://via.placeholder.com/200x80/0891b2/ffffff?text=Serene+Skin",
            "testimonial": "Professional, reliable, and innovative. Working with Ellavera has been a game-changer for our brand.",
            "position": "Founder, Serene Skin Co",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Pure Essence",
            "logo_url": "https://via.placeholder.com/200x80/06b6d4/ffffff?text=Pure+Essence",
            "testimonial": "Their attention to detail and customer service is unmatched. Highly recommended!",
            "position": "Brand Manager",
            "rating": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.clients.insert_many(clients)
    print(f"✅ Created {len(clients)} sample clients")
    
    # Create theme settings
    theme = {
        "primary_color": "#06b6d4",
        "accent_color": "#0891b2",
        "background_color": "#ffffff",
        "text_color": "#0f172a",
        "heading_font": "Playfair Display",
        "body_font": "Inter",
        "theme_mode": "light",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.theme_settings.insert_one(theme)
    print("✅ Theme settings configured")
    
    print("\n✨ Database seeding completed successfully!")
    print("\n🔑 Login credentials:")
    print("   Email: admin@ellavera.com")
    print("   Password: admin123")

if __name__ == "__main__":
    asyncio.run(seed_data())
    client.close()
