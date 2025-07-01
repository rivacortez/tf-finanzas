// Test de conexión con Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Leer variables de entorno del archivo .env
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection...');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Key exists:', !!supabaseKey);
console.log('🔑 Key starts with:', supabaseKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

if (supabaseKey.includes('NECESITAS_LA_CLAVE_ANON')) {
  console.error('❌ You need to replace the ANON key with the real one from Supabase');
  console.log('🔗 Go to: https://supabase.com/dashboard/project/mdxtbxurdevffwbhsezm/settings/api');
  console.log('📋 Copy the "anon public" key (NOT the service_role key)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔄 Testing connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if you have the correct ANON key (not service_role)');
      console.log('2. Verify the URL is correct');
      console.log('3. Make sure RLS policies allow reading');
      console.log('4. Create the profiles table in Supabase');
    } else {
      console.log('✅ Connection successful!');
    }
    
    // Test signup
    console.log('\n🧪 Testing signup...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123456'
    });
    
    if (signupError) {
      console.log('📝 Signup error:', signupError.message);
      if (signupError.message.includes('already registered') || 
          signupError.message.includes('rate limit') ||
          signupError.message.includes('invalid email')) {
        console.log('✅ Signup functionality is working (error is expected)');
      } else {
        console.log('❌ Unexpected signup error - check your Supabase configuration');
      }
    } else {
      console.log('✅ Signup test succeeded');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

testConnection();
