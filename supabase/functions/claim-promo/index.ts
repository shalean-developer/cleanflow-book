import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface ClaimRequest {
  code: string;
  serviceSlug: string;
  sessionId: string;
  email?: string;
  expiresAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log("🚀 Claim promo function started");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Check environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("❌ Missing environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Use service role key to bypass RLS for promo management
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    console.log("✅ Service role client created");

    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required to claim promo codes" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("❌ Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log("✅ User authenticated:", user.id);

    const userId = user.id;
    const { code, serviceSlug, sessionId, email, expiresAt }: ClaimRequest = await req.json();

    console.log("Claiming promo:", { code, serviceSlug, sessionId, userId });

    // Check for existing active claim for this session/code using service role
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

    // Create new claim using service role client (bypasses RLS)
    const serviceRoleSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: newClaim, error } = await serviceRoleSupabase
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
    console.error("❌ Error in claim-promo function:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Ensure we always return a proper CORS response even on error
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
