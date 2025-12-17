import requests
import sys
import json
from datetime import datetime

class EllaveraBeutyAPITester:
    def __init__(self, base_url="https://beauty-admin-27.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.text else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@ellavera.com", "password": "admin123"}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.admin_user_id = response.get('user', {}).get('id')
            print(f"   Admin logged in successfully, user_id: {self.admin_user_id}")
            return True
        return False

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "categories",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} categories")
            return response
        return []

    def test_get_products(self):
        """Test getting products"""
        success, response = self.run_test(
            "Get Products",
            "GET",
            "products",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products")
            return response
        return []

    def test_get_featured_products(self):
        """Test getting featured products"""
        success, response = self.run_test(
            "Get Featured Products",
            "GET",
            "products?featured=true",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} featured products")
            return response
        return []

    def test_get_articles(self):
        """Test getting articles"""
        success, response = self.run_test(
            "Get Articles",
            "GET",
            "articles",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} articles")
            return response
        return []

    def test_get_published_articles(self):
        """Test getting published articles"""
        success, response = self.run_test(
            "Get Published Articles",
            "GET",
            "articles?published=true",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} published articles")
            return response
        return []

    def test_get_clients(self):
        """Test getting clients"""
        success, response = self.run_test(
            "Get Clients",
            "GET",
            "clients",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} clients")
            return response
        return []

    def test_get_theme(self):
        """Test getting theme settings"""
        success, response = self.run_test(
            "Get Theme Settings",
            "GET",
            "theme",
            200
        )
        return success, response

    def test_contact_form_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "company": "Test Company",
            "message": "This is a test message from automated testing."
        }
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        return success, response

    def test_admin_get_contact_leads(self):
        """Test admin getting contact leads"""
        success, response = self.run_test(
            "Get Contact Leads (Admin)",
            "GET",
            "contact/leads",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} contact leads")
            return response
        return []

    def test_create_product(self, categories):
        """Test creating a product"""
        if not categories:
            print("   Skipping product creation - no categories available")
            return False, {}
        
        product_data = {
            "name": "Test Moisturizer",
            "category_id": categories[0]['id'],
            "description": "A premium moisturizer for all skin types",
            "benefits": "Hydrates and nourishes skin",
            "key_ingredients": "Hyaluronic acid, Vitamin E",
            "packaging_options": "50ml tube, 100ml jar",
            "featured": True
        }
        success, response = self.run_test(
            "Create Product (Admin)",
            "POST",
            "products",
            200,
            data=product_data
        )
        return success, response

    def test_ai_content_generation(self):
        """Test AI content generation"""
        ai_request = {
            "prompt": "Write a description for a premium anti-aging serum",
            "content_type": "product_description"
        }
        success, response = self.run_test(
            "AI Content Generation",
            "POST",
            "ai/generate-content",
            200,
            data=ai_request
        )
        if success and 'content' in response:
            print(f"   Generated content: {response['content'][:100]}...")
        return success, response

    def test_ai_image_generation(self):
        """Test AI image generation"""
        ai_request = {
            "prompt": "A premium cosmetic product bottle on a clean white background"
        }
        success, response = self.run_test(
            "AI Image Generation",
            "POST",
            "ai/generate-image",
            200,
            data=ai_request
        )
        if success and 'image_base64' in response:
            print(f"   Generated image (base64 length): {len(response['image_base64'])}")
        return success, response

    def test_get_homepage_sections(self):
        """Test getting homepage sections for hero carousel"""
        success, response = self.run_test(
            "Get Homepage Sections",
            "GET",
            "pages/home/sections",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} homepage sections")
            hero_section = next((s for s in response if s.get('section_type') == 'hero'), None)
            if hero_section:
                print(f"   Hero section found with ID: {hero_section.get('id')}")
                content = hero_section.get('content', {})
                bg_type = content.get('background_type', 'static')
                print(f"   Background type: {bg_type}")
                if bg_type == 'carousel':
                    carousel_images = content.get('background_carousel', [])
                    print(f"   Carousel images count: {len(carousel_images)}")
                    return True, hero_section
                elif bg_type == 'video':
                    video_url = content.get('background_video')
                    print(f"   Video URL: {video_url}")
                    return True, hero_section
                else:
                    static_image = content.get('background_image')
                    print(f"   Static image: {static_image}")
                    return True, hero_section
            else:
                print("   No hero section found")
                return False, {}
        return success, response

    def test_update_hero_section_carousel(self):
        """Test updating hero section to carousel background"""
        # First get existing hero section
        success, sections = self.test_get_homepage_sections()
        if not success:
            return False, {}
        
        hero_section = next((s for s in sections if s.get('section_type') == 'hero'), None)
        if not hero_section:
            print("   No hero section found to update")
            return False, {}
        
        # Update to carousel background with test images
        updated_content = hero_section.get('content', {}).copy()
        updated_content.update({
            'background_type': 'carousel',
            'background_carousel': [
                'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
                'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
            ],
            'background_overlay': 0.4
        })
        
        update_data = {
            'page_name': hero_section.get('page_name'),
            'section_name': hero_section.get('section_name'),
            'section_type': hero_section.get('section_type'),
            'content': updated_content,
            'order': hero_section.get('order'),
            'visible': hero_section.get('visible', True)
        }
        
        success, response = self.run_test(
            "Update Hero Section to Carousel",
            "PUT",
            f"pages/sections/{hero_section['id']}",
            200,
            data=update_data
        )
        
        if success:
            print("   Hero section updated to carousel background")
        return success, response

    def test_update_hero_section_static(self):
        """Test updating hero section to static background"""
        # First get existing hero section
        success, sections = self.test_get_homepage_sections()
        if not success:
            return False, {}
        
        hero_section = next((s for s in sections if s.get('section_type') == 'hero'), None)
        if not hero_section:
            print("   No hero section found to update")
            return False, {}
        
        # Update to static background
        updated_content = hero_section.get('content', {}).copy()
        updated_content.update({
            'background_type': 'static',
            'background_image': 'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=1920&q=80',
            'background_overlay': 0.3
        })
        
        update_data = {
            'page_name': hero_section.get('page_name'),
            'section_name': hero_section.get('section_name'),
            'section_type': hero_section.get('section_type'),
            'content': updated_content,
            'order': hero_section.get('order'),
            'visible': hero_section.get('visible', True)
        }
        
        success, response = self.run_test(
            "Update Hero Section to Static Image",
            "PUT",
            f"pages/sections/{hero_section['id']}",
            200,
            data=update_data
        )
        
        if success:
            print("   Hero section updated to static background")
        return success, response

def main():
    print("🧪 Starting Ellavera Beauty API Testing...")
    print("=" * 60)
    
    tester = EllaveraBeutyAPITester()
    
    # Test public endpoints first
    print("\n📋 Testing Public Endpoints...")
    categories = tester.test_get_categories()
    products = tester.test_get_products()
    featured_products = tester.test_get_featured_products()
    articles = tester.test_get_articles()
    published_articles = tester.test_get_published_articles()
    clients = tester.test_get_clients()
    theme_success, theme_data = tester.test_get_theme()
    
    # Test contact form
    contact_success, contact_data = tester.test_contact_form_submission()
    
    # Test admin login
    print("\n🔐 Testing Authentication...")
    if not tester.test_admin_login():
        print("❌ Admin login failed, skipping admin tests")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1
    
    # Test admin endpoints
    print("\n👑 Testing Admin Endpoints...")
    contact_leads = tester.test_admin_get_contact_leads()
    
    # Test product creation
    product_success, product_data = tester.test_create_product(categories)
    
    # Test AI features
    print("\n🤖 Testing AI Features...")
    ai_content_success, ai_content_data = tester.test_ai_content_generation()
    ai_image_success, ai_image_data = tester.test_ai_image_generation()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Summary of key findings
    print("\n📋 Summary:")
    print(f"   Categories: {len(categories)} found")
    print(f"   Products: {len(products)} found ({len(featured_products)} featured)")
    print(f"   Articles: {len(articles)} found ({len(published_articles)} published)")
    print(f"   Clients: {len(clients)} found")
    print(f"   Contact Leads: {len(contact_leads)} found")
    print(f"   Theme Settings: {'✅' if theme_success else '❌'}")
    print(f"   Contact Form: {'✅' if contact_success else '❌'}")
    print(f"   Product Creation: {'✅' if product_success else '❌'}")
    print(f"   AI Content Generation: {'✅' if ai_content_success else '❌'}")
    print(f"   AI Image Generation: {'✅' if ai_image_success else '❌'}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())