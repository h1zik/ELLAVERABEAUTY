import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os

async def seed_settings():
    client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
    db = client['ellavera_beauty']
    
    await db.site_settings.delete_many({})
    
    settings = {
        'site_name': 'Ellavera Beauty',
        'site_tagline': 'Premium Cosmetic Manufacturing',
        'logo_text': 'Ellavera Beauty',
        'footer_text': 'Premium cosmetic manufacturing solutions for your brand. We create beauty products that inspire confidence.',
        'contact_email': 'info@ellavera.com',
        'contact_phone': '+62 123 456 7890',
        'contact_address': 'Jakarta, Indonesia',
        'whatsapp_number': '6281234567890',
        'whatsapp_message': "Hello Ellavera Beauty! I'm interested in your cosmetic manufacturing services.",
        'google_maps_url': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.65833061103!2d106.68942995!3d-6.229386599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s',
        'facebook_url': '#',
        'instagram_url': '#',
        'twitter_url': '#',
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.site_settings.insert_one(settings)
    print('✅ Site settings seeded successfully')
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_settings())
