import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface BookingEmailData {
  bookingId: string;
  userEmail: string;
  userName: string;
  serviceName: string;
  date: string;
  time: string;
  totalAmount: number;
  currency: string;
  areaName: string;
  bedrooms: number;
  bathrooms: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { bookingId } = await req.json();
    
    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    console.log('Sending confirmation emails for booking:', bookingId);

    // Fetch booking details with related data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        services(name),
        service_areas(name)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Error fetching booking:', bookingError);
      throw new Error('Failed to fetch booking details');
    }

    // Get user email from auth
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(booking.user_id);
    
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      throw new Error('Failed to fetch user details');
    }

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';
    const serviceName = booking.services?.name || 'Cleaning Service';
    const areaName = booking.service_areas?.name || 'Cape Town';

    // Format date and time
    const bookingDate = new Date(booking.date).toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Booking Confirmation</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for booking with Shalean Cleaning Services! Your booking has been confirmed.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Booking Details</h2>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Location:</strong> ${areaName}</p>
          <p><strong>Property:</strong> ${booking.bedrooms} bedroom(s), ${booking.bathrooms} bathroom(s)</p>
          <p><strong>Total Amount:</strong> ${booking.currency} ${booking.total_amount}</p>
          ${booking.special_instructions ? `<p><strong>Special Instructions:</strong> ${booking.special_instructions}</p>` : ''}
        </div>
        
        <p>We look forward to providing you with excellent service!</p>
        <p>Best regards,<br>Shalean Cleaning Services Team</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Shalean Cleaning Services <bookings@shalean.com>',
      to: [user.email!],
      subject: 'Booking Confirmation - Shalean Cleaning Services',
      html: customerEmailHtml,
    });

    console.log('Customer confirmation email sent to:', user.email);

    // Send notification to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Booking Received</h1>
        <p>A new booking has been confirmed.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Booking Details</h2>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Customer:</strong> ${userName} (${user.email})</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Location:</strong> ${areaName}</p>
          <p><strong>Property:</strong> ${booking.bedrooms} bedroom(s), ${booking.bathrooms} bathroom(s)</p>
          <p><strong>Total Amount:</strong> ${booking.currency} ${booking.total_amount}</p>
          <p><strong>Payment Status:</strong> ${booking.status}</p>
          ${booking.special_instructions ? `<p><strong>Special Instructions:</strong> ${booking.special_instructions}</p>` : ''}
          ${booking.house_details ? `<p><strong>House Details:</strong> ${booking.house_details}</p>` : ''}
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Shalean Cleaning Services System <bookings@shalean.com>',
      to: ['bookings@shalean.com'],
      subject: `New Booking: ${serviceName} - ${bookingDate}`,
      html: adminEmailHtml,
    });

    console.log('Admin notification email sent');

    return new Response(
      JSON.stringify({ success: true, message: 'Emails sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending emails:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
