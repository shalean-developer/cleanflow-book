import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Always use test keys for now
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

    const metadata = paystackData.data.metadata;
    const bookingData = metadata.booking_data;

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        reference: bookingReference,
        user_id: user.id,
        service_id: bookingData.service_id,
        bedrooms: bookingData.bedrooms,
        bathrooms: bookingData.bathrooms,
        extras: bookingData.extras,
        date: bookingData.date,
        time: bookingData.time,
        frequency: bookingData.frequency,
        location: bookingData.location,
        special_instructions: bookingData.special_instructions,
        cleaner_id: bookingData.cleaner_id === 'auto-match' ? null : bookingData.cleaner_id,
        phone_number: bookingData.phone_number,
        pricing: bookingData.pricing,
        customer_email: user.email,
        status: 'confirmed',
        payment_reference: reference,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw new Error('Failed to create booking');
    }

    console.log('Booking created:', booking.id);

    // Handle promo redemption if promo was used
    if (metadata.promo && metadata.promo.claimId) {
      const promoData = metadata.promo;
      
      // Create redemption record
      const { error: redemptionError } = await supabase
        .from('promo_redemptions')
        .insert({
          code: promoData.code,
          user_id: user.id,
          booking_id: booking.id,
          claimed_id: promoData.claimId,
          discount_type: promoData.type,
          discount_value: promoData.value,
          applies_to: promoData.appliesTo,
        });

      if (redemptionError) {
        console.error('Failed to create redemption record:', redemptionError);
      } else {
        // Update claim status to redeemed
        const { error: updateError } = await supabase
          .from('promo_claims')
          .update({ status: 'redeemed' })
          .eq('id', promoData.claimId);

        if (updateError) {
          console.error('Failed to update claim status:', updateError);
        } else {
          console.log('Promo redeemed successfully:', promoData.code);
        }
      }
    }

    supabase.functions.invoke('send-booking-confirmation', {
      body: { bookingId: booking.id }
    }).then(({ error: emailError }) => {
      if (emailError) {
        console.error('Error sending emails:', emailError);
      } else {
        console.log('Emails sent successfully');
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        booking,
        payment: {
          amount: paystackData.data.amount / 100,
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
