#!/bin/bash
# Authentication API Test Script
# This script tests the authentication endpoints using curl commands

# Set colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set the base URL
BASE_URL="http://localhost:9090/api/v1/auth"

# Test user details
TEST_EMAIL="testuser_$(date +%s)@example.com"
TEST_USERNAME="testuser_$(date +%s)"
TEST_PASSWORD="securepassword123"

# Track test results
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_status="$3"
    local success_message="$4"
    local failure_message="$5"
    
    echo -e "\n${BLUE}Running test: ${test_name}${NC}"
    echo "Command: $command"
    
    # Run the command and capture output and status code
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    # Execute the command
    response=$(eval $command 2>&1)
    status=$?
    
    # Extract HTTP status code if present in response
    http_status=$(echo "$response" | grep -oP 'HTTP/[0-9.]+ \K[0-9]+' || echo "N/A")
    
    # Check if the test passed
    if [[ "$status" -eq 0 && ("$expected_status" == "any" || "$http_status" == "$expected_status" || "$http_status" == "N/A") ]]; then
        echo -e "${GREEN}✓ Test passed: ${success_message}${NC}"
        echo -e "Response: $response"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ Test failed: ${failure_message}${NC}"
        echo -e "Response: $response"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Print header
echo -e "\n${YELLOW}===== Authentication API Test Suite =====${NC}"
echo -e "Started at: $(date)"
echo -e "Testing against: ${BASE_URL}"
echo -e "Test user: ${TEST_USERNAME} / ${TEST_EMAIL}"
echo -e "${YELLOW}=======================================${NC}\n"

# Test 1: Register a new user
register_command="curl -s -w 'HTTP status: %{http_code}' -X POST \"${BASE_URL}/register\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"email\": \"${TEST_EMAIL}\",
    \"username\": \"${TEST_USERNAME}\",
    \"password\": \"${TEST_PASSWORD}\"
  }'"

run_test "User Registration" "$register_command" "201" \
    "User registration successful" \
    "User registration failed"

# Store the response for potential debugging
REGISTER_RESPONSE=$response

# Test 2: Try to register with the same username (should fail)
duplicate_username_command="curl -s -w 'HTTP status: %{http_code}' -X POST \"${BASE_URL}/register\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"email\": \"different_${TEST_EMAIL}\",
    \"username\": \"${TEST_USERNAME}\",
    \"password\": \"${TEST_PASSWORD}\"
  }'"

run_test "Duplicate Username" "$duplicate_username_command" "400" \
    "Duplicate username correctly rejected" \
    "Duplicate username test failed"

# Test 3: Try to register with the same email (should fail)
duplicate_email_command="curl -s -w 'HTTP status: %{http_code}' -X POST \"${BASE_URL}/register\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"email\": \"${TEST_EMAIL}\",
    \"username\": \"different_${TEST_USERNAME}\",
    \"password\": \"${TEST_PASSWORD}\"
  }'"

run_test "Duplicate Email" "$duplicate_email_command" "400" \
    "Duplicate email correctly rejected" \
    "Duplicate email test failed"

# Test 4: Login with valid credentials
login_command="curl -s -w 'HTTP status: %{http_code}' -X POST \"${BASE_URL}/token\" \
  -H \"Content-Type: application/x-www-form-urlencoded\" \
  -d \"username=${TEST_USERNAME}&password=${TEST_PASSWORD}\""

run_test "Valid Login" "$login_command" "200" \
    "Login successful" \
    "Login failed"

# Extract the token from the response
TOKEN=$(echo $response | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

# Test 5: Login with invalid password
invalid_password_command="curl -s -w 'HTTP status: %{http_code}' -X POST \"${BASE_URL}/token\" \
  -H \"Content-Type: application/x-www-form-urlencoded\" \
  -d \"username=${TEST_USERNAME}&password=wrongpassword\""

run_test "Invalid Password" "$invalid_password_command" "401" \
    "Invalid password correctly rejected" \
    "Invalid password test failed"

# Test 6: Login with non-existent user
nonexistent_user_command="curl -s -w 'HTTP status: %{http_code}' -X POST \"${BASE_URL}/token\" \
  -H \"Content-Type: application/x-www-form-urlencoded\" \
  -d \"username=nonexistentuser&password=${TEST_PASSWORD}\""

run_test "Non-existent User" "$nonexistent_user_command" "401" \
    "Non-existent user correctly rejected" \
    "Non-existent user test failed"

# Test 7: Access protected route with valid token
if [ -n "$TOKEN" ]; then
    protected_route_command="curl -s -w 'HTTP status: %{http_code}' -X GET \"${BASE_URL}/me\" \
      -H \"Authorization: Bearer ${TOKEN}\""

    run_test "Protected Route Access" "$protected_route_command" "200" \
        "Protected route access successful" \
        "Protected route access failed"
else
    echo -e "${RED}✗ Skipping protected route test: No token available${NC}"
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Test 8: Access protected route with invalid token
invalid_token_command="curl -s -w 'HTTP status: %{http_code}' -X GET \"${BASE_URL}/me\" \
  -H \"Authorization: Bearer invalidtoken\""

run_test "Invalid Token" "$invalid_token_command" "401" \
    "Invalid token correctly rejected" \
    "Invalid token test failed"

# Test 9: Access protected route without token
no_token_command="curl -s -w 'HTTP status: %{http_code}' -X GET \"${BASE_URL}/me\""

run_test "No Token" "$no_token_command" "401" \
    "No token correctly rejected" \
    "No token test failed"

# Print summary
echo -e "\n${YELLOW}===== Test Summary =====${NC}"
echo -e "Total tests: ${TESTS_TOTAL}"
echo -e "${GREEN}Tests passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Tests failed: ${TESTS_FAILED}${NC}"
echo -e "Completed at: $(date)"
echo -e "${YELLOW}======================${NC}\n"

# Return exit code based on test results
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed successfully!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the output above for details.${NC}"
    exit 1
fi
