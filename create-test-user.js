import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uehqemljqehbcfpxyfma.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaHFlbWxqcWVoYmNmcHh5Zm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzYyNTEsImV4cCI6MjA3NjExMjI1MX0.aFS-R5Vm88DSUeusNAlQrb3G1Vi4sYQhpreMJLKOeMk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('👤 Creating Test User...\n')

async function createTestUser() {
  const email = 'test@example.com'
  const password = 'test123456'
  const fullName = 'Test User'
  const phone = '+216 12 345 678'

  console.log('📧 Email:', email)
  console.log('🔒 Password:', password)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('✅ User already exists!')
      console.log('\n🔐 You can login with:')
      console.log('   Email:', email)
      console.log('   Password:', password)
    } else {
      console.log('❌ Error:', error.message)
    }
  } else {
    console.log('✅ Test user created successfully!')
    console.log('\n📋 User Details:')
    console.log('   ID:', data.user?.id)
    console.log('   Email:', data.user?.email)
    console.log('\n🔐 Login Credentials:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('\n⚠️  Note: Check your email to confirm your account')
    console.log('   (Or disable email confirmation in Supabase Auth settings)')
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n📍 Next Steps:')
  console.log('   1. Go to http://localhost:3001/login')
  console.log('   2. Login with the credentials above')
  console.log('   3. Then try accessing Messages page')
  console.log('\n')
}

createTestUser().catch(console.error)
