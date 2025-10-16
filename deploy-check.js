#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Verifies that everything is ready for Vercel deployment
 */

import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔍 Checking deployment readiness...\n')

let hasErrors = false
let hasWarnings = false

// Check 1: vercel.json exists
console.log('1️⃣  Checking vercel.json...')
if (existsSync(join(__dirname, 'vercel.json'))) {
  console.log('   ✅ vercel.json found\n')
} else {
  console.log('   ❌ vercel.json not found!\n')
  hasErrors = true
}

// Check 2: package.json has build script
console.log('2️⃣  Checking package.json...')
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('   ✅ Build script found:', packageJson.scripts.build)
  } else {
    console.log('   ❌ Build script not found in package.json!')
    hasErrors = true
  }
  
  if (packageJson.dependencies) {
    console.log('   ✅ Dependencies found:', Object.keys(packageJson.dependencies).length, 'packages')
  }
  console.log()
} catch (error) {
  console.log('   ❌ Error reading package.json:', error.message, '\n')
  hasErrors = true
}

// Check 3: Environment variables
console.log('3️⃣  Checking environment variables...')
console.log('   ⚠️  Remember to add these in Vercel Dashboard:')
console.log('      - VITE_SUPABASE_URL')
console.log('      - VITE_SUPABASE_ANON_KEY')
console.log('   ℹ️  See .env.example for values\n')
hasWarnings = true

// Check 4: index.html exists
console.log('4️⃣  Checking index.html...')
if (existsSync(join(__dirname, 'index.html'))) {
  console.log('   ✅ index.html found\n')
} else {
  console.log('   ❌ index.html not found!\n')
  hasErrors = true
}

// Check 5: src directory exists
console.log('5️⃣  Checking src directory...')
if (existsSync(join(__dirname, 'src'))) {
  console.log('   ✅ src directory found\n')
} else {
  console.log('   ❌ src directory not found!\n')
  hasErrors = true
}

// Check 6: Git status
console.log('6️⃣  Git status...')
if (existsSync(join(__dirname, '.git'))) {
  console.log('   ✅ Git repository initialized')
  console.log('   ℹ️  Make sure to commit and push all changes before deploying\n')
} else {
  console.log('   ⚠️  Git repository not found')
  console.log('   ℹ️  Initialize with: git init\n')
  hasWarnings = true
}

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('\n📊 SUMMARY:\n')

if (hasErrors) {
  console.log('❌ Deployment check FAILED')
  console.log('   Please fix the errors above before deploying.\n')
  process.exit(1)
} else if (hasWarnings) {
  console.log('⚠️  Deployment check passed with warnings')
  console.log('   Review the warnings above.\n')
  console.log('✅ You can proceed with deployment!')
  console.log('\n📖 Next steps:')
  console.log('   1. Commit and push your code to GitHub')
  console.log('   2. Go to https://vercel.com')
  console.log('   3. Import your repository')
  console.log('   4. Add environment variables')
  console.log('   5. Deploy!\n')
  console.log('📚 See VERCEL_QUICK_START.md for detailed instructions\n')
} else {
  console.log('✅ All checks passed!')
  console.log('\n📖 Next steps:')
  console.log('   1. Commit and push your code to GitHub')
  console.log('   2. Go to https://vercel.com')
  console.log('   3. Import your repository')
  console.log('   4. Add environment variables')
  console.log('   5. Deploy!\n')
  console.log('📚 See VERCEL_QUICK_START.md for detailed instructions\n')
}
