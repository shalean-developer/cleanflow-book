import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use live keys for production, test keys for development/preview
    const isProduction = Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined;
    const paystackPublicKey = isProduction 
      ? Deno.env.get('PAYSTACK_PUBLIC_KEY_LIVE')
      : Deno.env.get('PAYSTACK_PUBLIC_KEY');
    
    if (!paystackPublicKey) {
      throw new Error('Paystack public key not configured');
    }

    return new Response(
      JSON.stringify({ publicKey: paystackPublicKey }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
