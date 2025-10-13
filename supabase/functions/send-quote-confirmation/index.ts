import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface QuoteRequestData {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  location: {
    address1: string;
    address2: string;
    city: string;
    postal: string;
  };
  bedrooms: number;
  bathrooms: number;
  extras: string[];
  instructions: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quoteData: QuoteRequestData = await req.json();
    
    if (!quoteData.id || !quoteData.customer.email) {
      throw new Error('Quote ID and email are required');
    }

    console.log('Sending quote confirmation for:', quoteData.id);
    
    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured, emails will not be sent');
      return new Response(
        JSON.stringify({ success: true, warning: 'Email service not configured, but quote was saved' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const { customer, location, bedrooms, bathrooms, extras, instructions } = quoteData;
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const fullAddress = `${location.address1}${location.address2 ? ', ' + location.address2 : ''}, ${location.city}, ${location.postal}`;
    
    const extrasText = extras.length > 0 
      ? extras.map(e => e.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')
      : 'None';

    // Send confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0C53ED;">Quote Request Received</h1>
        <p>Hi ${customer.firstName},</p>
        <p>Thank you for your interest in Shalean Cleaning Services! We have received your quote request and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Your Request Details</h2>
          <p><strong>Quote Reference:</strong> ${quoteData.id}</p>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Phone:</strong> ${customer.phone}</p>
          <p><strong>Address:</strong> ${fullAddress}</p>
          <p><strong>Bedrooms:</strong> ${bedrooms}</p>
          <p><strong>Bathrooms:</strong> ${bathrooms}</p>
          <p><strong>Additional Services:</strong> ${extrasText}</p>
          ${instructions ? `<p><strong>Special Instructions:</strong> ${instructions}</p>` : ''}
        </div>
        
        <p>One of our team members will review your request and contact you shortly with a customized quote.</p>
        <p>Best regards,<br>Shalean Cleaning Services Team</p>
      </div>
    `;

    let customerEmailSent = false;
    let adminEmailSent = false;

    // Try to send customer confirmation email
    try {
      await resend.emails.send({
        from: 'Shalean Bookings <bookings@shalean.com>',
        to: [customer.email],
        subject: `Your Shalean Booking Quote Request – ${fullName}`,
        html: customerEmailHtml,
      });
      customerEmailSent = true;
      console.log('Customer quote confirmation sent');
    } catch (emailError) {
      console.error('Failed to send customer email:', emailError);
    }

    // Try to send admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0C53ED;">New Quote Request</h1>
        <p>A new quote request has been received.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
          <p><strong>Quote Reference:</strong> ${quoteData.id}</p>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone}</p>
          <p><strong>Address:</strong> ${fullAddress}</p>
          <p><strong>Bedrooms:</strong> ${bedrooms}</p>
          <p><strong>Bathrooms:</strong> ${bathrooms}</p>
          <p><strong>Additional Services:</strong> ${extrasText}</p>
          ${instructions ? `<p><strong>Special Instructions:</strong> ${instructions}</p>` : ''}
        </div>
        
        <p>Please respond to this quote request within 24 hours.</p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'Shalean Bookings <bookings@shalean.com>',
        to: ['bookings@shalean.com'],
        subject: `New Quote Request: ${fullName}`,
        html: adminEmailHtml,
      });
      adminEmailSent = true;
      console.log('Admin notification sent');
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Quote processed successfully',
        emailStatus: {
          customerEmailSent,
          adminEmailSent
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending quote emails:', error);
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
