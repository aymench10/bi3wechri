// Test script to check environment variables
console.log('=== Environment Variables Test ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');
console.log('All env vars:', import.meta.env);
