export const runtime = 'edge'
export const revalidate = 43200 // 12 hours - ISR revalidation

export async function GET(req: Request) {
  try {
    // Fetch with proper caching for Vercel
    const upstream = await fetch(
      'https://v6.exchangerate-api.com/v6/7e4da0422403a6fa684ad9eb/latest/USD',
      {
        headers: { 
          Accept: 'application/json',
          'User-Agent': 'Currency-Converter-App/1.0'
        },
        next: { 
          revalidate: 43200, // 12 hours
          tags: ['exchange-rates'] // For on-demand revalidation
        },
      }
    )

    if (!upstream.ok) {
      throw new Error(`Upstream API error: ${upstream.status} ${upstream.statusText}`)
    }

    const data = await upstream.json()

    // Validate response structure
    if (!data.result || data.result !== 'success' || !data.conversion_rates) {
      throw new Error('Invalid API response structure')
    }

    const body = {
      result: data.result,
      base: data.base_code,
      rates: data.conversion_rates,
      time_last_update_unix: data.time_last_update_unix,
      time_last_update_utc: data.time_last_update_utc,
      time_next_update_unix: data.time_next_update_unix,
      time_next_update_utc: data.time_next_update_utc,
      documentation: data.documentation,
      terms_of_use: data.terms_of_use,
      cached_at: new Date().toISOString(), // Track when we cached this
    }

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Optimized for Vercel Edge Network
        'Cache-Control': 'public, max-age=300, s-maxage=43200, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'max-age=43200',
        'Vercel-CDN-Cache-Control': 'max-age=43200',
        // CORS headers for client-side requests
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Additional performance headers
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    })
  } catch (err) {
    console.error('Exchange rate fetch error:', err)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch exchange rates',
        message: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
      }
    )
  }
}