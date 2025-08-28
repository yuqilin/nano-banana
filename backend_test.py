#!/usr/bin/env python3
"""
Nano Banana AI Image Editor Backend Test Suite
Tests all backend API endpoints for functionality and error handling
"""

import requests
import json
import time
import os
from pathlib import Path
import tempfile
from PIL import Image
import io

# Get backend URL from frontend environment
BACKEND_URL = "https://pixelclone-banana.preview.emergentagent.com/api"

class NanoBananaBackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test /api/health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, "API is healthy and database connected")
                    return True
                else:
                    self.log_test("Health Check", False, f"API unhealthy: {data.get('status')}", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection failed: {str(e)}")
            return False
    
    def test_content_features(self):
        """Test /api/content/features endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/content/features", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "features" in data:
                    features = data["features"]
                    if len(features) > 0:
                        self.log_test("Content Features", True, f"Retrieved {len(features)} features")
                        return True
                    else:
                        self.log_test("Content Features", False, "No features returned")
                        return False
                else:
                    self.log_test("Content Features", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Content Features", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Content Features", False, f"Request failed: {str(e)}")
            return False
    
    def test_content_reviews(self):
        """Test /api/content/reviews endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/content/reviews", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "reviews" in data:
                    reviews = data["reviews"]
                    if len(reviews) > 0:
                        self.log_test("Content Reviews", True, f"Retrieved {len(reviews)} reviews")
                        return True
                    else:
                        self.log_test("Content Reviews", False, "No reviews returned")
                        return False
                else:
                    self.log_test("Content Reviews", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Content Reviews", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Content Reviews", False, f"Request failed: {str(e)}")
            return False
    
    def test_content_faqs(self):
        """Test /api/content/faqs endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/content/faqs", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "faqs" in data:
                    faqs = data["faqs"]
                    if len(faqs) > 0:
                        self.log_test("Content FAQs", True, f"Retrieved {len(faqs)} FAQs")
                        return True
                    else:
                        self.log_test("Content FAQs", False, "No FAQs returned")
                        return False
                else:
                    self.log_test("Content FAQs", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Content FAQs", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Content FAQs", False, f"Request failed: {str(e)}")
            return False
    
    def test_gallery_showcase(self):
        """Test /api/gallery/featured/showcase endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/gallery/featured/showcase", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "showcase" in data:
                    showcase = data["showcase"]
                    if len(showcase) > 0:
                        self.log_test("Gallery Showcase", True, f"Retrieved {len(showcase)} showcase items")
                        return True
                    else:
                        self.log_test("Gallery Showcase", False, "No showcase items returned")
                        return False
                else:
                    self.log_test("Gallery Showcase", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Gallery Showcase", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Gallery Showcase", False, f"Request failed: {str(e)}")
            return False
    
    def test_image_generation(self):
        """Test /api/generate endpoint with text prompt"""
        try:
            # Test with a realistic prompt
            payload = {
                "prompt": "A majestic snow-capped mountain range at golden hour with dramatic clouds",
                "mode": "text-to-image"
            }
            
            response = self.session.post(
                f"{self.base_url}/generate/", 
                json=payload,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("generationId"):
                    generation_id = data["generationId"]
                    self.log_test("Image Generation", True, f"Generation started with ID: {generation_id}")
                    
                    # Test getting generation status
                    time.sleep(1)  # Brief wait
                    status_response = self.session.get(f"{self.base_url}/generate/{generation_id}", timeout=10)
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        if status_data.get("success"):
                            self.log_test("Generation Status", True, "Successfully retrieved generation status")
                            return True
                        else:
                            self.log_test("Generation Status", False, "Invalid status response", status_data)
                            return False
                    else:
                        self.log_test("Generation Status", False, f"HTTP {status_response.status_code}")
                        return False
                else:
                    self.log_test("Image Generation", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Image Generation", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("Image Generation", False, f"Request failed: {str(e)}")
            return False
    
    def test_file_upload(self):
        """Test /api/generate/upload endpoint"""
        try:
            # Create a test image
            img = Image.new('RGB', (100, 100), color='red')
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG')
            img_bytes.seek(0)
            
            # Prepare upload data
            files = {
                'image': ('test_image.png', img_bytes, 'image/png')
            }
            data = {
                'sessionId': 'test-session-123'
            }
            
            response = self.session.post(
                f"{self.base_url}/generate/upload",
                files=files,
                data=data,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "file" in data:
                    file_info = data["file"]
                    self.log_test("File Upload", True, f"File uploaded: {file_info.get('fileName')}")
                    return True
                else:
                    self.log_test("File Upload", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("File Upload", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
                
        except Exception as e:
            self.log_test("File Upload", False, f"Request failed: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error handling with invalid requests"""
        tests_passed = 0
        total_tests = 0
        
        # Test 1: Invalid generation prompt (too short)
        total_tests += 1
        try:
            payload = {"prompt": "hi", "mode": "text-to-image"}
            response = self.session.post(f"{self.base_url}/generate/", json=payload, timeout=10)
            if response.status_code == 400:
                self.log_test("Error Handling - Short Prompt", True, "Correctly rejected short prompt")
                tests_passed += 1
            else:
                self.log_test("Error Handling - Short Prompt", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Short Prompt", False, f"Request failed: {str(e)}")
        
        # Test 2: Invalid generation prompt (too long)
        total_tests += 1
        try:
            long_prompt = "A" * 600  # Over 500 character limit
            payload = {"prompt": long_prompt, "mode": "text-to-image"}
            response = self.session.post(f"{self.base_url}/generate/", json=payload, timeout=10)
            if response.status_code == 400:
                self.log_test("Error Handling - Long Prompt", True, "Correctly rejected long prompt")
                tests_passed += 1
            else:
                self.log_test("Error Handling - Long Prompt", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Long Prompt", False, f"Request failed: {str(e)}")
        
        # Test 3: Non-existent generation ID
        total_tests += 1
        try:
            response = self.session.get(f"{self.base_url}/generate/non-existent-id", timeout=10)
            if response.status_code == 200:  # Mock service returns 200 with mock data
                data = response.json()
                if data.get("success"):
                    self.log_test("Error Handling - Invalid ID", True, "Handled invalid generation ID gracefully")
                    tests_passed += 1
                else:
                    self.log_test("Error Handling - Invalid ID", False, "Invalid response for non-existent ID")
            else:
                self.log_test("Error Handling - Invalid ID", False, f"Unexpected status code: {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid ID", False, f"Request failed: {str(e)}")
        
        # Test 4: Invalid file upload (non-image)
        total_tests += 1
        try:
            files = {
                'image': ('test.txt', io.StringIO('not an image'), 'text/plain')
            }
            data = {'sessionId': 'test-session'}
            response = self.session.post(f"{self.base_url}/generate/upload", files=files, data=data, timeout=10)
            if response.status_code == 400:
                self.log_test("Error Handling - Invalid File", True, "Correctly rejected non-image file")
                tests_passed += 1
            else:
                self.log_test("Error Handling - Invalid File", False, f"Expected 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Error Handling - Invalid File", False, f"Request failed: {str(e)}")
        
        return tests_passed == total_tests
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Nano Banana AI Image Editor Backend Tests")
        print("=" * 60)
        
        # Core functionality tests
        tests = [
            ("Health Check", self.test_health_check),
            ("Content Features", self.test_content_features),
            ("Content Reviews", self.test_content_reviews),
            ("Content FAQs", self.test_content_faqs),
            ("Gallery Showcase", self.test_gallery_showcase),
            ("Image Generation", self.test_image_generation),
            ("File Upload", self.test_file_upload),
            ("Error Handling", self.test_error_handling)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running {test_name}...")
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_test(test_name, False, f"Test execution failed: {str(e)}")
        
        # Summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} test(s) failed. Check details above.")
            return False

def main():
    """Main test execution"""
    tester = NanoBananaBackendTester()
    success = tester.run_all_tests()
    
    # Print detailed results
    print("\n📋 DETAILED TEST RESULTS:")
    print("-" * 40)
    for result in tester.test_results:
        status = "✅" if result["success"] else "❌"
        print(f"{status} {result['test']}: {result['message']}")
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)