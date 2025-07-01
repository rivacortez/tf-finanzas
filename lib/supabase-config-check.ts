// Script de diagnóstico para verificar la configuración
const checkSupabaseConfig = () => {
  console.log('=== DIAGNÓSTICO DE CONFIGURACIÓN ===');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('📋 Variables de entorno:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Configurada' : '❌ No configurada');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Configurada' : '❌ No configurada');
  
  if (supabaseUrl?.includes('placeholder') || supabaseKey?.includes('placeholder')) {
    console.error('❌ ERROR: Estás usando valores placeholder!');
    console.log('🔧 SOLUCIÓN: Configura las credenciales reales de Supabase en .env.local');
    return false;
  }
  
  console.log('✅ Configuración básica OK');
  return true;
};

export { checkSupabaseConfig };
