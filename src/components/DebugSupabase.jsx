import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const DebugSupabase = () => {
  const [debug, setDebug] = useState({})

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check env vars
        const envVars = {
          url: import.meta.env.VITE_SUPABASE_URL,
          keyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
        }

        // Try to fetch ads
        const { data, error, count } = await supabase
          .from('ads')
          .select('*', { count: 'exact' })

        setDebug({
          envVars,
          adsCount: count,
          adsData: data,
          error: error?.message,
          supabaseConnected: !error
        })

        console.log('=== SUPABASE DEBUG ===')
        console.log('ENV URL:', envVars.url)
        console.log('ENV KEY EXISTS:', envVars.keyExists)
        console.log('ENV KEY LENGTH:', envVars.keyLength)
        console.log('ADS COUNT:', count)
        console.log('ADS DATA:', data)
        console.log('ERROR:', error)
      } catch (err) {
        console.error('Debug error:', err)
        setDebug({ error: err.message })
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔍 Supabase Debug</h3>
      <pre className="overflow-auto max-h-96">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  )
}

export default DebugSupabase
