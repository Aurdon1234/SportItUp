 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

let supabaseServiceSingleton = null

export function getSupabaseServerClient(opts) {
  const useServiceRole = _optionalChain([opts, 'optionalAccess', _ => _.useServiceRole]) !== false // default true
  if (supabaseServiceSingleton) return supabaseServiceSingleton

  const cookieStore = cookies()
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_ANON_KEY

  // Using createServerClient with cookie handlers as recommended
  supabaseServiceSingleton = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return _optionalChain([cookieStore, 'access', _2 => _2.get, 'call', _3 => _3(name), 'optionalAccess', _4 => _4.value])
      },
      set(name, value, options) {
        // no-op for route handlers
      },
      remove(name, options) {
        // no-op for route handlers
      },
    },
  })

  return supabaseServiceSingleton
}
