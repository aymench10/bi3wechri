// Test Supabase connection
// Run with: node test-supabase-connection.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uehqemljqehbcfpxyfma.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaHFlbWxqcWVoYmNmcHh5Zm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzYyNTEsImV4cCI6MjA3NjExMjI1MX0.aFS-R5Vm88DSUeusNAlQrb3G1Vi4sYQhpreMJLKOeMk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...\n')
  
  // Test 1: Check messages table
  console.log('1. Checking messages table...')
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .limit(1)
  
  if (messagesError) {
    console.error('❌ Messages table error:', messagesError.message)
    console.error('   Code:', messagesError.code)
    console.error('   Details:', messagesError.details)
  } else {
    console.log('✅ Messages table accessible')
    console.log('   Found', messages?.length || 0, 'messages')
  }
  
  // Test 2: Check ads table
  console.log('\n2. Checking ads table...')
  const { data: ads, error: adsError } = await supabase
    .from('ads')
    .select('*')
    .limit(1)
  
  if (adsError) {
    console.error('❌ Ads table error:', adsError.message)
  } else {
    console.log('✅ Ads table accessible')
    console.log('   Found', ads?.length || 0, 'ads')
  }
  
  // Test 3: Check profiles table
  console.log('\n3. Checking profiles table...')
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
  
  if (profilesError) {
    console.error('❌ Profiles table error:', profilesError.message)
  } else {
    console.log('✅ Profiles table accessible')
    console.log('   Found', profiles?.length || 0, 'profiles')
  }
}

testConnection().catch(console.error)
