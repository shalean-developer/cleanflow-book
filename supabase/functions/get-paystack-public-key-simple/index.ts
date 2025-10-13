import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to get the key, but don't fail if it's missing
    const paystackPublicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY');
    
    if (paystackPublicKey) {
      return new Response(
        JSON.stringify({ publicKey: paystackPublicKey }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      // Return a fallback test key if live key is not available
      return new Response(
        JSON.stringify({ 
          publicKey: 'pk_test_51234567890abcdef1234567890abcdef12345678',
          message: 'Using fallback test key - live key not configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Function error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
