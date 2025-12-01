import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
import uuid

async def seed_contact_page():
    client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
    db = client['ellavera_beauty']
    
    print("🌱 Seeding contact page content...")
    
    # Check if contact page sections already exist
    existing = await db.page_sections.find_one({"page_name": "contact"})
    if existing:
        print("⚠️  Contact page sections already exist. Skipping...")
        client.close()
        return
    
    # Contact Page Sections
    contact_sections = [
        {
            "id": str(uuid.uuid4()),
            "page_name": "contact",
            "section_name": "Hero",
            "section_type": "hero",
            "order": 1,
            "visible": True,
            "content": {
                "title": "Get in Touch",
                "title_highlight": "Contact Us",
                "description": "Have questions about our cosmetic manufacturing services? We're here to help bring your beauty brand vision to life."
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "contact",
            "section_name": "Contact Information",
            "section_type": "contact_info",
            "order": 2,
            "visible": True,
            "content": {
                "heading": "Contact Information",
                "subheading": "Reach out to us through any of the following channels",
                "email": "info@ellavera.com",
                "phone": "+62 123 456 7890",
                "address": "Jakarta, Indonesia",
                "whatsapp_number": "6281234567890",
                "whatsapp_message": "Hello Ellavera Beauty! I'm interested in your cosmetic manufacturing services."
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "page_name": "contact",
            "section_name": "Map Location",
            "section_type": "map",
            "order": 3,
            "visible": True,
            "content": {
                "heading": "Visit Our Office",
                "google_maps_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.65833061103!2d106.68942995!3d-6.229386599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Insert contact page sections
    await db.page_sections.insert_many(contact_sections)
    
    print(f"✅ Created {len(contact_sections)} contact page sections")
    print("✨ Contact page seeding completed!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_contact_page())
