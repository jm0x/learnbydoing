#!/usr/bin/env node
/**
 * Test runner for Learn By Doing frontend tests.
 * Provides a clean output of test results with pass/fail status.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Run tests and display results
 */
function runTests() {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bright}LEARN BY DOING - FRONTEND TEST SUITE${colors.reset}`);
  console.log(`Started at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(80));

  // Define test categories
  const testCategories = [
    { name: 'Authentication Service Tests', path: 'services/auth.service.test.js' },
    { name: 'Login Component Tests', path: 'components/LoginForm.test.js' },
    // Add more test categories as they are created
  ];

  // Track overall statistics
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTime = 0;

  // Run each test category
  testCategories.forEach(category => {
    console.log(`\n${colors.bright}${category.name}:${colors.reset}`);
    console.log('-'.repeat(80));

    const testPath = path.join(__dirname, category.path);
    
    // Skip if test file doesn't exist yet
    if (!fs.existsSync(testPath)) {
      console.log(`${colors.yellow}⚠️ Test file not found: ${category.path}${colors.reset}`);
      return;
    }

    const startTime = Date.now();
    
    try {
      // Run Jest with specific test file
      const result = execSync(`npx jest ${testPath} --colors`, { 
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      
      // Parse results to get test counts
      const matches = result.match(/(\d+) passed, (\d+) failed/);
      const passed = matches ? parseInt(matches[1]) : 0;
      const failed = matches ? parseInt(matches[2]) : 0;
      
      totalPassed += passed;
      
      const duration = (Date.now() - startTime) / 1000;
      totalTime += duration;
      
      if (failed === 0) {
        console.log(`${colors.green}✅ ALL TESTS PASSED${colors.reset} in ${duration.toFixed(2)} seconds`);
      } else {
        totalFailed += failed;
        console.log(`${colors.red}❌ ${failed} TESTS FAILED${colors.reset}, ${passed} passed in ${duration.toFixed(2)} seconds`);
        // Show the full output for failed tests
        console.log(result);
      }
    } catch (error) {
      totalFailed += 1; // At least one test failed
      const duration = (Date.now() - startTime) / 1000;
      totalTime += duration;
      console.log(`${colors.red}❌ TESTS FAILED${colors.reset} in ${duration.toFixed(2)} seconds`);
      console.log(error.stdout.toString());
    }
  });

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bright}TEST SUMMARY:${colors.reset}`);
  console.log(`Total Tests: ${totalPassed + totalFailed}`);
  console.log(`${colors.green}Passed: ${totalPassed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${totalFailed}${colors.reset}`);
  console.log(`Total Time: ${totalTime.toFixed(2)} seconds`);
  console.log('='.repeat(80) + '\n');

  return totalFailed > 0 ? 1 : 0;
}

// Run tests if this script is executed directly
if (require.main === module) {
  process.exit(runTests());
}

module.exports = { runTests };
