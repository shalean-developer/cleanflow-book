import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { reference } = await req.json();
    if (!reference) {
      throw new Error('Payment reference is required');
    }

    console.log('Verifying payment:', reference);

    // Verify transaction with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
        },
      }
    );

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      console.error('Paystack verification error:', errorData);
      throw new Error(`Payment verification failed: ${errorData.message}`);
    }

    const paystackData = await paystackResponse.json();
    console.log('Paystack verification response:', paystackData);

    if (paystackData.data.status !== 'success') {
      throw new Error('Payment was not successful');
    }

    // Update booking status to confirmed
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
      })
      .eq('payment_reference', reference)
      .select()
      .single();

    if (updateError) {
      console.error('Booking update error:', updateError);
      throw new Error('Failed to update booking status');
    }

    // Send confirmation emails in the background
    console.log('Triggering confirmation emails for booking:', booking.id);
    supabase.functions.invoke('send-booking-confirmation', {
      body: { bookingId: booking.id }
    }).then(({ error: emailError }) => {
      if (emailError) {
        console.error('Error sending confirmation emails:', emailError);
      } else {
        console.log('Confirmation emails triggered successfully');
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        booking,
        payment: {
          amount: paystackData.data.amount / 100, // Convert from kobo to naira
          status: paystackData.data.status,
          paid_at: paystackData.data.paid_at,
        },
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
