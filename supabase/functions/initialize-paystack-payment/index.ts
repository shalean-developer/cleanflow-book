import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  email: string;
  amount: number;
  bookingData: {
    serviceId: string;
    serviceName: string;
    bedrooms: number;
    bathrooms: number;
    extras: Array<{ id: string; name: string; price: number }>;
    date: string;
    time: string;
    areaId: string;
    areaName: string;
    frequency: string;
    cleanerId: string;
    cleanerName: string;
    specialInstructions?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const requestData: PaymentRequest = await req.json();
    console.log('Payment request:', { email: requestData.email, amount: requestData.amount });

    // Convert amount to kobo (Paystack uses smallest currency unit)
    const amountInKobo = Math.round(requestData.amount * 100);

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: requestData.email,
        amount: amountInKobo,
        metadata: {
          user_id: user.id,
          booking_data: requestData.bookingData,
        },
      }),
    });

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      console.error('Paystack error:', errorData);
      throw new Error(`Paystack initialization failed: ${errorData.message}`);
    }

    const paystackData = await paystackResponse.json();
    console.log('Paystack response:', paystackData);

    // Create a pending booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service_id: requestData.bookingData.serviceId,
        area_id: requestData.bookingData.areaId,
        cleaner_id: requestData.bookingData.cleanerId,
        booking_date: requestData.bookingData.date,
        booking_time: requestData.bookingData.time,
        bedrooms: requestData.bookingData.bedrooms,
        bathrooms: requestData.bookingData.bathrooms,
        frequency: requestData.bookingData.frequency,
        special_instructions: requestData.bookingData.specialInstructions,
        total_amount: requestData.amount,
        status: 'pending',
        payment_reference: paystackData.data.reference,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw new Error('Failed to create booking');
    }

    // Store booking extras
    if (requestData.bookingData.extras.length > 0) {
      const bookingExtras = requestData.bookingData.extras.map(extra => ({
        booking_id: booking.id,
        extra_id: extra.id,
        price: extra.price,
      }));

      const { error: extrasError } = await supabase
        .from('booking_extras')
        .insert(bookingExtras);

      if (extrasError) {
        console.error('Extras creation error:', extrasError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
        booking_id: booking.id,
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
