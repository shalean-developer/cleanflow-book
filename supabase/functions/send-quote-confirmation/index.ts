import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface QuoteRequestData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message }: QuoteRequestData = await req.json();
    
    if (!name || !email || !service) {
      throw new Error('Name, email, and service are required');
    }

    console.log('Sending quote confirmation to:', email);

    // Send confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Quote Request Received</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your interest in Shalean Cleaning Services! We have received your quote request and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Your Request Details</h2>
          <p><strong>Service:</strong> ${service}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        </div>
        
        <p>One of our team members will review your request and contact you shortly with a customized quote.</p>
        <p>Best regards,<br>Shalean Cleaning Services Team</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Shalean Cleaning Services <bookings@shalean.com>',
      to: [email],
      subject: 'Quote Request Received - Shalean Cleaning Services',
      html: customerEmailHtml,
    });

    console.log('Customer quote confirmation sent');

    // Send notification to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Quote Request</h1>
        <p>A new quote request has been received.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Service:</strong> ${service}</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        </div>
        
        <p>Please respond to this quote request within 24 hours.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Shalean Cleaning Services System <bookings@shalean.com>',
      to: ['bookings@shalean.com'],
      subject: `New Quote Request: ${service}`,
      html: adminEmailHtml,
    });

    console.log('Admin notification sent');

    return new Response(
      JSON.stringify({ success: true, message: 'Quote confirmation emails sent' }),
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
