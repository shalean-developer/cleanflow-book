import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { applicationId } = await req.json();
    
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    console.log('Sending confirmation emails for application:', applicationId);

    // Fetch application details
    const { data: application, error: applicationError } = await supabase
      .from('cleaner_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (applicationError || !application) {
      console.error('Error fetching application:', applicationError);
      throw new Error('Failed to fetch application details');
    }

    const fullName = `${application.first_name} ${application.last_name}`;
    const applicationRef = application.id.substring(0, 8).toUpperCase();
    const areasShort = (application.areas as string[]).slice(0, 3).join(', ');
    const allAreas = (application.areas as string[]).join(', ');
    const skills = (application.skills as string[]).join(', ');
    const languages = (application.languages as string[]).join(', ');
    const availableDays = (application.available_days as string[]).join(', ');

    // Send confirmation email to applicant
    const applicantEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0C53ED 0%, #2A869E 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Application Received!</h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Dear ${application.first_name},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Thank you for applying to join the Shalean team! We've successfully received your application
            and appreciate your interest in working with us.
          </p>

          <div style="background: #EAF2FF; border-left: 4px solid #0C53ED; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333; font-size: 14px;">
              <strong style="color: #0C53ED;">Application Reference ID:</strong><br/>
              <span style="font-size: 20px; font-family: monospace; font-weight: bold; color: #0C53ED;">${applicationRef}</span>
            </p>
          </div>

          <h2 style="color: #180D39; font-size: 20px; margin-top: 30px;">What Happens Next?</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <ol style="color: #555; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 12px;">
                <strong>Review Process:</strong> Our team will review your application within 3-5 business days
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Reference Checks:</strong> We'll conduct reference checks for shortlisted candidates
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Background Verification:</strong> Verification checks will be performed as per your consent
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Interview:</strong> Selected applicants will be invited for an interview (in-person or virtual)
              </li>
              <li>
                <strong>Final Decision:</strong> We'll notify you of the outcome via email
              </li>
            </ol>
          </div>

          <div style="background: #fff9e6; border: 1px solid #ffd966; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⏰ Timeline:</strong> We aim to respond to all applications within 5 business days.
              If you don't hear from us within this time, please feel free to follow up.
            </p>
          </div>

          <h2 style="color: #180D39; font-size: 18px; margin-top: 30px;">Your Application Summary</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #333; width: 40%;">Position Applied For</td>
              <td style="padding: 12px; border: 1px solid #dee2e6; color: #555;">Cleaning Professional</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #333;">Work Frequency</td>
              <td style="padding: 12px; border: 1px solid #dee2e6; color: #555;">${application.frequency}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #333;">Preferred Areas</td>
              <td style="padding: 12px; border: 1px solid #dee2e6; color: #555;">${allAreas}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #333;">Earliest Start Date</td>
              <td style="padding: 12px; border: 1px solid #dee2e6; color: #555;">${new Date(application.earliest_start_date).toLocaleDateString('en-ZA')}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #e9ecef;">
            <p style="color: #333; font-size: 15px; line-height: 1.6;">
              If you have any questions or need to update your application, please contact us:
            </p>
            <p style="color: #0C53ED; font-size: 15px; margin: 10px 0;">
              📧 Email: <a href="mailto:careers@shalean.com" style="color: #0C53ED; text-decoration: none;">careers@shalean.com</a>
            </p>
            <p style="color: #555; font-size: 14px; margin-top: 20px;">
              We look forward to potentially welcoming you to the Shalean family!
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #666; font-size: 13px; margin: 5px 0;">
              Best regards,<br/>
              <strong style="color: #0C53ED;">The Shalean Team</strong>
            </p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">Shalean Cleaning Services</p>
          <p style="margin: 5px 0;">Cape Town, South Africa</p>
          <p style="margin: 5px 0;">
            <a href="https://shalean.co.za" style="color: #0C53ED; text-decoration: none;">www.shalean.co.za</a>
          </p>
        </div>
      </div>
    `;

    const applicantEmailText = `
Dear ${application.first_name},

Thank you for applying to join the Shalean team! We've successfully received your application.

Application Reference ID: ${applicationRef}

WHAT HAPPENS NEXT?

1. Review Process: Our team will review your application within 3-5 business days
2. Reference Checks: We'll conduct reference checks for shortlisted candidates
3. Background Verification: Verification checks will be performed as per your consent
4. Interview: Selected applicants will be invited for an interview
5. Final Decision: We'll notify you of the outcome via email

YOUR APPLICATION SUMMARY
- Position Applied For: Cleaning Professional
- Work Frequency: ${application.frequency}
- Preferred Areas: ${allAreas}
- Earliest Start Date: ${new Date(application.earliest_start_date).toLocaleDateString('en-ZA')}

If you have any questions, contact us at careers@shalean.com

Best regards,
The Shalean Team
    `.trim();

    await resend.emails.send({
      from: 'Shalean Careers <careers@shalean.com>',
      to: [application.email],
      subject: `Application Received - ${applicationRef}`,
      html: applicantEmailHtml,
      text: applicantEmailText,
    });

    console.log('Applicant confirmation email sent');

    // Send notification to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0C53ED 0%, #2A869E 100%); padding: 30px 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">🎯 NEW APPLICATION RECEIVED</h1>
        </div>
        
        <div style="padding: 30px; background: #ffffff;">
          <div style="background: #EAF2FF; border-left: 4px solid #0C53ED; padding: 20px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; color: #0C53ED; font-size: 22px;">${fullName}</h2>
            <p style="margin: 0; color: #333; font-size: 16px;">
              <strong>Areas:</strong> ${areasShort}${(application.areas as string[]).length > 3 ? '...' : ''}
            </p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
              <strong>Reference ID:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${applicationRef}</code>
            </p>
          </div>

          <h3 style="color: #180D39; font-size: 18px; margin-top: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            Personal Information
          </h3>
          <table style="width: 100%; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 35%;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; color: #333;">${fullName}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 8px 12px; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 8px 12px; color: #333;">
                <a href="mailto:${application.email}" style="color: #0C53ED; text-decoration: none;">${application.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0; color: #333;">
                <a href="tel:${application.phone}" style="color: #0C53ED; text-decoration: none;">${application.phone}</a>
              </td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 8px 12px; color: #666;"><strong>ID/Passport:</strong></td>
              <td style="padding: 8px 12px; color: #333;">${application.id_number_or_passport}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Date of Birth:</strong></td>
              <td style="padding: 8px 0; color: #333;">${new Date(application.date_of_birth).toLocaleDateString('en-ZA')}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 8px 12px; color: #666;"><strong>Work Permit:</strong></td>
              <td style="padding: 8px 12px; color: #333;">${application.has_work_permit ? '✅ Yes' : '❌ No'}</td>
            </tr>
          </table>

          <h3 style="color: #180D39; font-size: 18px; margin-top: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            Address
          </h3>
          <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 10px 0;">
            ${application.address_line1}${application.address_line2 ? ', ' + application.address_line2 : ''}<br/>
            ${application.suburb_city}, ${application.postal_code}<br/>
            <strong>Own Transport:</strong> ${application.has_own_transport ? '✅ Yes' : '❌ No'}
          </p>

          <h3 style="color: #180D39; font-size: 18px; margin-top: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            Experience & Skills
          </h3>
          <table style="width: 100%; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 35%;"><strong>Years Experience:</strong></td>
              <td style="padding: 8px 0; color: #333;">${application.years_experience} years</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 8px 12px; color: #666;"><strong>Skills:</strong></td>
              <td style="padding: 8px 12px; color: #333;">${skills}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Comfortable with Pets:</strong></td>
              <td style="padding: 8px 0; color: #333;">${application.comfortable_with_pets ? '✅ Yes' : '❌ No'}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 8px 12px; color: #666;"><strong>Languages:</strong></td>
              <td style="padding: 8px 12px; color: #333;">${languages}</td>
            </tr>
          </table>

          <h3 style="color: #180D39; font-size: 18px; margin-top: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            Availability
          </h3>
          <table style="width: 100%; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 35%;"><strong>Available Days:</strong></td>
              <td style="padding: 8px 0; color: #333;">${availableDays}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 8px 12px; color: #666;"><strong>Preferred Start Time:</strong></td>
              <td style="padding: 8px 12px; color: #333;">${application.start_time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Frequency:</strong></td>
              <td style="padding: 8px 0; color: #333;">${application.frequency}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 8px 12px; color: #666;"><strong>Earliest Start Date:</strong></td>
              <td style="padding: 8px 12px; color: #333;">${new Date(application.earliest_start_date).toLocaleDateString('en-ZA')}</td>
            </tr>
          </table>

          <h3 style="color: #180D39; font-size: 18px; margin-top: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            Preferred Working Areas
          </h3>
          <p style="color: #333; font-size: 14px; margin: 10px 0;">${allAreas}</p>

          <h3 style="color: #180D39; font-size: 18px; margin-top: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            References
          </h3>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 15px;">Reference 1</h4>
            <p style="margin: 5px 0; color: #555; font-size: 14px;">
              <strong>Name:</strong> ${application.ref1_name}<br/>
              <strong>Phone:</strong> <a href="tel:${application.ref1_phone}" style="color: #0C53ED; text-decoration: none;">${application.ref1_phone}</a><br/>
              <strong>Relationship:</strong> ${application.ref1_relationship}
            </p>
          </div>

          ${application.ref2_name ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 15px;">Reference 2</h4>
            <p style="margin: 5px 0; color: #555; font-size: 14px;">
              <strong>Name:</strong> ${application.ref2_name}<br/>
              <strong>Phone:</strong> <a href="tel:${application.ref2_phone}" style="color: #0C53ED; text-decoration: none;">${application.ref2_phone}</a><br/>
              <strong>Relationship:</strong> ${application.ref2_relationship}
            </p>
          </div>
          ` : ''}

          <h3 style="color: #180D39; font-size: 18px; margin-top: 25px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            Documents
          </h3>
          <ul style="list-style: none; padding: 0; margin: 10px 0;">
            <li style="margin: 8px 0;">
              📄 <a href="${application.cv_url}" style="color: #0C53ED; text-decoration: none;" target="_blank">CV/Resume</a>
            </li>
            <li style="margin: 8px 0;">
              🆔 <a href="${application.id_doc_url}" style="color: #0C53ED; text-decoration: none;" target="_blank">ID Document</a>
            </li>
            <li style="margin: 8px 0;">
              🏠 <a href="${application.proof_of_address_url}" style="color: #0C53ED; text-decoration: none;" target="_blank">Proof of Address</a>
            </li>
            ${application.certificate_url ? `
            <li style="margin: 8px 0;">
              🎓 <a href="${application.certificate_url}" style="color: #0C53ED; text-decoration: none;" target="_blank">Certificate</a>
            </li>
            ` : ''}
          </ul>

          <div style="background: #e7f3ff; border: 1px solid #0C53ED; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
            <p style="margin: 0; color: #333; font-size: 15px;">
              <strong>Next Steps:</strong> Review the application and contact the applicant if interested.
            </p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
            <p style="color: #666; font-size: 13px; margin: 5px 0;">
              Application submitted: ${new Date(application.created_at).toLocaleString('en-ZA')}
            </p>
          </div>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Shalean Applications <careers@shalean.com>',
      to: ['careers@shalean.com'],
      subject: `NEW APPLICATION – ${fullName} (${areasShort})`,
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

