#!/bin/bash
# Main test runner for Learn By Doing project
# This script runs all tests for both backend and frontend

# Set colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Track overall test status
BACKEND_STATUS=0
FRONTEND_STATUS=0
API_TEST_STATUS=0

# Print header
echo -e "\n${YELLOW}=========================================${NC}"
echo -e "${YELLOW}   LEARN BY DOING - COMPLETE TEST SUITE   ${NC}"
echo -e "${YELLOW}=========================================${NC}"
echo -e "Started at: $(date)"
echo -e "Project directory: $(pwd)"
echo -e "${YELLOW}=========================================${NC}\n"

# Function to check if server is running
check_server() {
    echo -e "${BLUE}Checking if backend server is running...${NC}"
    if curl -s http://localhost:9090/api/v1/health > /dev/null; then
        echo -e "${GREEN}Backend server is running.${NC}"
        return 0
    else
        echo -e "${RED}Backend server is not running.${NC}"
        return 1
    fi
}

# Function to run backend tests
run_backend_tests() {
    echo -e "\n${CYAN}=== Running Backend Unit Tests ===${NC}"
    cd backend
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    python tests/run_tests.py
    BACKEND_STATUS=$?
    cd ..
    
    if [ $BACKEND_STATUS -eq 0 ]; then
        echo -e "${GREEN}Backend unit tests completed successfully.${NC}"
    else
        echo -e "${RED}Backend unit tests failed.${NC}"
    fi
}

# Function to run API tests
run_api_tests() {
    echo -e "\n${CYAN}=== Running API Integration Tests ===${NC}"
    
    # Check if server is running
    if check_server; then
        # Run API tests
        backend/tests/scripts/test_auth_api.sh
        API_TEST_STATUS=$?
        
        if [ $API_TEST_STATUS -eq 0 ]; then
            echo -e "${GREEN}API integration tests completed successfully.${NC}"
        else
            echo -e "${RED}API integration tests failed.${NC}"
        fi
    else
        echo -e "${YELLOW}Skipping API tests as backend server is not running.${NC}"
        echo -e "To run API tests, start the server with:"
        echo -e "  cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 9090"
        API_TEST_STATUS=2  # Skipped
    fi
}

# Function to run frontend tests
run_frontend_tests() {
    echo -e "\n${CYAN}=== Running Frontend Tests ===${NC}"
    
    # Check if node_modules exists
    if [ -d "frontend/node_modules" ]; then
        cd frontend
        node src/tests/run_tests.js
        FRONTEND_STATUS=$?
        cd ..
        
        if [ $FRONTEND_STATUS -eq 0 ]; then
            echo -e "${GREEN}Frontend tests completed successfully.${NC}"
        else
            echo -e "${RED}Frontend tests failed.${NC}"
        fi
    else
        echo -e "${YELLOW}Skipping frontend tests as node_modules is not found.${NC}"
        echo -e "To run frontend tests, first install dependencies:"
        echo -e "  cd frontend && npm install"
        FRONTEND_STATUS=2  # Skipped
    fi
}

# Run all tests
run_backend_tests
run_api_tests
run_frontend_tests

# Print summary
echo -e "\n${YELLOW}=========================================${NC}"
echo -e "${YELLOW}             TEST SUMMARY                ${NC}"
echo -e "${YELLOW}=========================================${NC}"

# Backend unit tests status
if [ $BACKEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Backend Unit Tests: PASSED${NC}"
else
    echo -e "${RED}✗ Backend Unit Tests: FAILED${NC}"
fi

# API integration tests status
if [ $API_TEST_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ API Integration Tests: PASSED${NC}"
elif [ $API_TEST_STATUS -eq 2 ]; then
    echo -e "${YELLOW}⚠ API Integration Tests: SKIPPED${NC}"
else
    echo -e "${RED}✗ API Integration Tests: FAILED${NC}"
fi

# Frontend tests status
if [ $FRONTEND_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend Tests: PASSED${NC}"
elif [ $FRONTEND_STATUS -eq 2 ]; then
    echo -e "${YELLOW}⚠ Frontend Tests: SKIPPED${NC}"
else
    echo -e "${RED}✗ Frontend Tests: FAILED${NC}"
fi

echo -e "\nCompleted at: $(date)"
echo -e "${YELLOW}=========================================${NC}\n"

# Calculate overall status
OVERALL_STATUS=0
if [ $BACKEND_STATUS -ne 0 ] && [ $BACKEND_STATUS -ne 2 ]; then
    OVERALL_STATUS=1
fi
if [ $API_TEST_STATUS -ne 0 ] && [ $API_TEST_STATUS -ne 2 ]; then
    OVERALL_STATUS=1
fi
if [ $FRONTEND_STATUS -ne 0 ] && [ $FRONTEND_STATUS -ne 2 ]; then
    OVERALL_STATUS=1
fi

# Final message
if [ $OVERALL_STATUS -eq 0 ]; then
    echo -e "${GREEN}All tests completed successfully!${NC}"
else
    echo -e "${RED}Some tests failed. Please check the output above for details.${NC}"
fi

exit $OVERALL_STATUS
