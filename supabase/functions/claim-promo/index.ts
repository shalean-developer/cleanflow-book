import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClaimRequest {
  code: string;
  serviceSlug: string;
  sessionId: string;
  email?: string;
  expiresAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const { code, serviceSlug, sessionId, email, expiresAt }: ClaimRequest = await req.json();

    console.log("Claiming promo:", { code, serviceSlug, sessionId, userId });

    // Check for existing active claim for this session/code
    const { data: existingClaims } = await supabase
      .from("promo_claims")
      .select("*")
      .eq("code", code)
      .eq("session_id", sessionId)
      .eq("status", "claimed")
      .single();

    if (existingClaims) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          claim: existingClaims,
          message: "Promo already claimed" 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create new claim
    const { data: newClaim, error } = await supabase
      .from("promo_claims")
      .insert({
        code,
        user_id: userId,
        email,
        service_slug: serviceSlug,
        applies_to: serviceSlug,
        session_id: sessionId,
        expires_at: expiresAt,
        status: "claimed",
      })
      .select()
      .single();

    if (error) {
      console.error("Error claiming promo:", error);
      throw error;
    }

    console.log("Promo claimed successfully:", newClaim);

    return new Response(
      JSON.stringify({ 
        success: true, 
        claim: newClaim,
        message: "Promo applied successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in claim-promo function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
