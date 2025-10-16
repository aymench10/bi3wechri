import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uehqemljqehbcfpxyfma.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaHFlbWxqcWVoYmNmcHh5Zm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzYyNTEsImV4cCI6MjA3NjExMjI1MX0.aFS-R5Vm88DSUeusNAlQrb3G1Vi4sYQhpreMJLKOeMk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Testing Messages Access (Without Authentication)...\n')

async function testMessagesAccess() {
  // Test 1: Try to read messages without auth
  console.log('1️⃣  Reading messages (no auth)...')
  const { data, error } = await supabase
    .from('messages')
    .select('*, ads(title, images, price)')
    .limit(5)

  if (error) {
    console.log('   ❌ Error:', error.message)
    console.log('   Code:', error.code)
    console.log('   Hint:', error.hint || 'N/A')
    
    if (error.code === 'PGRST116') {
      console.log('\n   ℹ️  This error means Row Level Security (RLS) is blocking')
      console.log('      access because you are not authenticated.')
      console.log('\n   ✅ Solution: You need to LOGIN first!')
    }
  } else {
    console.log('   ✅ Success! Found', data?.length || 0, 'messages')
    if (data && data.length > 0) {
      console.log('\n   Sample message:')
      console.log('   -', data[0])
    }
  }

  // Test 2: Check if any messages exist at all (from any user)
  console.log('\n2️⃣  Checking messages table structure...')
  const { count, error: countError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.log('   ❌ Error:', countError.message)
  } else {
    console.log('   ✅ Table exists, total messages:', count || 0)
  }

  // Test 3: Check profiles
  console.log('\n3️⃣  Checking profiles (should be public)...')
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .limit(3)

  if (profileError) {
    console.log('   ❌ Error:', profileError.message)
  } else {
    console.log('   ✅ Success! Found', profiles?.length || 0, 'profiles')
  }

  // Test 4: Check ads
  console.log('\n4️⃣  Checking ads...')
  const { data: ads, error: adsError } = await supabase
    .from('ads')
    .select('id, title')
    .limit(3)

  if (adsError) {
    console.log('   ❌ Error:', adsError.message)
  } else {
    console.log('   ✅ Success! Found', ads?.length || 0, 'ads')
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📝 SUMMARY:')
  console.log('   The messages page requires you to be LOGGED IN.')
  console.log('   Please create an account or login to use messaging.\n')
}

testMessagesAccess().catch(console.error)
