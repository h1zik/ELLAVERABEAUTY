import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
import uuid

async def migrate_reviews():
    """Migrate testimonials from clients to reviews collection"""
    client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
    db = client['ellavera_beauty']
    
    print("🔄 Starting migration: Clients → Reviews...")
    
    # Get all clients with testimonials
    clients_with_testimonials = await db.clients.find(
        {"testimonial": {"$exists": True, "$ne": None}}, 
        {"_id": 0}
    ).to_list(1000)
    
    print(f"Found {len(clients_with_testimonials)} clients with testimonials")
    
    reviews_created = 0
    for client_data in clients_with_testimonials:
        if client_data.get('testimonial'):
            # Create review from client testimonial
            review = {
                "id": str(uuid.uuid4()),
                "customer_name": client_data['name'],
                "review_text": client_data['testimonial'],
                "rating": client_data.get('rating', 5),
                "position": client_data.get('position'),
                "company": None,
                "photo_url": client_data.get('logo_url'),  # Use logo as photo
                "created_at": client_data.get('created_at', datetime.now(timezone.utc).isoformat())
            }
            
            await db.reviews.insert_one(review)
            reviews_created += 1
            print(f"  ✅ Created review for: {client_data['name']}")
    
    print(f"\n✅ Migration complete! Created {reviews_created} reviews")
    
    # Update clients - remove testimonial, position, rating fields
    print("\n🔄 Cleaning up client documents...")
    result = await db.clients.update_many(
        {},
        {"$unset": {"testimonial": "", "position": "", "rating": ""}}
    )
    print(f"✅ Updated {result.modified_count} client documents")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_reviews())
