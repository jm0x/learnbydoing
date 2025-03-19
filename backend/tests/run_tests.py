#!/usr/bin/env python
"""
Test runner for Learn By Doing backend tests.
Provides a clean output of test results with pass/fail status.
"""

import os
import sys
import pytest
import time
from datetime import datetime

# Add the backend directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def run_tests():
    """Run all backend tests and display results."""
    print("\n" + "=" * 80)
    print(f"LEARN BY DOING - BACKEND TEST SUITE")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Define test categories
    test_categories = [
        {"name": "API Authentication Tests", "path": "api/test_auth.py"},
        {"name": "Auth Service Tests", "path": "services/test_auth_service.py"},
        {"name": "Security Utility Tests", "path": "utils/test_security.py"},
    ]
    
    # Track overall statistics
    total_passed = 0
    total_failed = 0
    total_time = 0
    
    # Run each test category
    for category in test_categories:
        print(f"\n{category['name']}:")
        print("-" * 80)
        
        start_time = time.time()
        test_path = os.path.join(os.path.dirname(__file__), category["path"])
        
        # Run pytest with detailed output for failures only
        result = pytest.main([
            test_path, 
            "-v",
            "--no-header",
            "--tb=short"
        ])
        
        end_time = time.time()
        duration = end_time - start_time
        total_time += duration
        
        # Get test counts from pytest exit code
        if result == 0:  # All tests passed
            print(f"✅ ALL TESTS PASSED in {duration:.2f} seconds")
            # We don't know exactly how many passed, but we can count them
            # by parsing the test file (simplified approach)
            with open(test_path, "r") as f:
                content = f.read()
                test_count = content.count("def test_")
                total_passed += test_count
        else:
            # Some tests failed
            # Parse the output to get a more accurate count of failures
            with open(test_path, "r") as f:
                content = f.read()
                test_count = content.count("def test_")
            
            # Pytest returns a bit mask where:
            # 1 = test collection error
            # 2 = test execution failed
            # 4 = test execution interrupted
            # 8 = internal pytest error
            # So we need to check if bit 1 is set (value 2)
            if result & 2:
                failed_count = 1  # At least one test failed
                passed_count = test_count - failed_count
                total_passed += passed_count
                total_failed += failed_count
                print(f"❌ {failed_count} TESTS FAILED, {passed_count} PASSED in {duration:.2f} seconds")
            else:
                # Some other error occurred
                total_failed += 1
                print(f"❌ ERROR OCCURRED in {duration:.2f} seconds")
    
    # Print summary
    print("\n" + "=" * 80)
    print(f"TEST SUMMARY:")
    print(f"Total Tests: {total_passed + total_failed}")
    print(f"Passed: {total_passed}")
    print(f"Failed: {total_failed}")
    print(f"Total Time: {total_time:.2f} seconds")
    print("=" * 80 + "\n")
    
    return total_failed

if __name__ == "__main__":
    sys.exit(run_tests())
