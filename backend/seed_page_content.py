import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
import uuid

async def seed_page_content():
    client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
    db = client['ellavera_beauty']
    
    print("🌱 Seeding page content...")
    
    # Clear existing page sections
    await db.page_sections.delete_many({})
    
    # Homepage Sections
    homepage_sections = [
        {
            "id": str(uuid.uuid4()),
            "page_name": "home",
            "section_name": "Hero Section",
            "section_type": "hero",
            "order": 1,
            "visible": True,
            "content": {
                "badge_text": "Premium Cosmetic Manufacturing",
                "title": "Transform Your Beauty Brand with",
                "title_highlight": "Ellavera Beauty",
                "description": "We manufacture premium cosmetic products tailored to your brand vision. From formulation to packaging, we bring your beauty products to life.",
                "cta_primary_text": "Explore Products",
                "cta_primary_link": "/products",
                "cta_secondary_text": "Get a Quote",
                "cta_secondary_link": "/contact"
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "home",
            "section_name": "Why Choose Us",
            "section_type": "features",
            "order": 2,
            "visible": True,
            "content": {
                "heading": "Why Choose Ellavera Beauty",
                "subheading": "We combine expertise, quality, and innovation to create exceptional cosmetic products",
                "features": [
                    {
                        "title": "Certified Quality",
                        "description": "BPOM & Halal certified manufacturing with international quality standards",
                        "icon": "CheckCircle"
                    },
                    {
                        "title": "Custom Formulations",
                        "description": "Tailored formulas designed specifically for your brand and target market",
                        "icon": "Sparkles"
                    },
                    {
                        "title": "End-to-End Service",
                        "description": "Complete support from formulation to packaging and distribution",
                        "icon": "Star"
                    }
                ]
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "home",
            "section_name": "Services",
            "section_type": "services",
            "order": 3,
            "visible": True,
            "content": {
                "heading": "Our Cosmetic Manufacturing Services",
                "subheading": "Comprehensive solutions for all your cosmetic manufacturing needs",
                "services": [
                    {"name": "Skincare", "description": "Premium skincare products manufactured to perfection"},
                    {"name": "Body Care", "description": "Premium body care products manufactured to perfection"},
                    {"name": "Hair Care", "description": "Premium hair care products manufactured to perfection"},
                    {"name": "Fragrance", "description": "Premium fragrance products manufactured to perfection"}
                ]
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "home",
            "section_name": "Process",
            "section_type": "process",
            "order": 4,
            "visible": True,
            "content": {
                "heading": "Our Process",
                "subheading": "A streamlined approach from concept to final product",
                "steps": [
                    {"step": "01", "title": "Consultation", "description": "Understanding your brand vision and requirements"},
                    {"step": "02", "title": "Formulation", "description": "Creating custom formulas tailored to your needs"},
                    {"step": "03", "title": "Testing", "description": "Rigorous quality control and safety testing"},
                    {"step": "04", "title": "Production", "description": "Manufacturing with state-of-the-art equipment"},
                    {"step": "05", "title": "Packaging", "description": "Premium packaging design and execution"},
                    {"step": "06", "title": "Delivery", "description": "Efficient distribution and logistics support"}
                ]
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "home",
            "section_name": "CTA Section",
            "section_type": "cta",
            "order": 5,
            "visible": True,
            "content": {
                "heading": "Ready to Launch Your Beauty Brand?",
                "description": "Let's discuss how we can bring your cosmetic product vision to life",
                "button_text": "Contact Us Today",
                "button_link": "/contact"
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # About Page Sections
    about_sections = [
        {
            "id": str(uuid.uuid4()),
            "page_name": "about",
            "section_name": "Hero",
            "section_type": "hero",
            "order": 1,
            "visible": True,
            "content": {
                "title": "About Ellavera Beauty",
                "description": "Your trusted partner in cosmetic manufacturing excellence"
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "about",
            "section_name": "Company Story",
            "section_type": "text",
            "order": 2,
            "visible": True,
            "content": {
                "heading": "Our Story",
                "paragraphs": [
                    "Ellavera Beauty was founded with a singular vision: to empower beauty brands with world-class cosmetic manufacturing services. With years of expertise in the cosmetics industry, we understand the unique challenges brands face in bringing their products to market.",
                    "We specialize in custom formulation, private label manufacturing, and complete turnkey solutions. Our state-of-the-art facilities are equipped with the latest technology, allowing us to create products that meet the highest quality standards while maintaining competitive pricing.",
                    "From skincare to haircare, body care to fragrances, we have the capability and expertise to manufacture a wide range of cosmetic products. Our commitment to quality, innovation, and customer satisfaction has made us a preferred partner for brands across the globe."
                ]
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "about",
            "section_name": "Vision & Mission",
            "section_type": "vision_mission",
            "order": 3,
            "visible": True,
            "content": {
                "vision": {
                    "title": "Our Vision",
                    "text": "To be the leading cosmetic manufacturer that enables beauty brands worldwide to create exceptional products that inspire confidence and transform lives."
                },
                "mission": {
                    "title": "Our Mission",
                    "text": "To provide innovative, high-quality cosmetic manufacturing solutions with unparalleled customer service, helping brands bring their vision to life through cutting-edge formulations and sustainable practices."
                }
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Insert all sections
    all_sections = homepage_sections + about_sections
    if all_sections:
        await db.page_sections.insert_many(all_sections)
    
    print(f"✅ Created {len(homepage_sections)} homepage sections")
    print(f"✅ Created {len(about_sections)} about page sections")
    print("✨ Page content seeding completed!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_page_content())
