// send-status-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface StatusUpdateRequest {
  to: string;
  subject: string;
  html: string;
  freelancer_name: string;
  invoice_id: string;
  status: 'Approved' | 'Rejected' | 'Paid';
  rejection_reason?: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Rate limiting (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string, maxEmails = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const key = `email:${email}`;
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxEmails) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: StatusUpdateRequest = await req.json();
    
    // Validation
    if (!body.to || !body.subject || !body.html || !body.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html, status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!isValidEmail(body.to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    if (!checkRateLimit(body.to)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from environment variable with fallback to the known key
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_ZZ7MiDeK_NpskHF388TiKZTgQum99zc1x";
    
    // Check if we're in production mode with a valid API key
    const isProduction = !!RESEND_API_KEY;

    if (isProduction) {
      try {
        // Initialize Resend client with API key
        const resend = new Resend(RESEND_API_KEY);
        
        // Send email using Resend
        const { data, error } = await resend.emails.send({
          from: "Invoy <notifications@invoy.app>",
          to: [body.to],
          subject: body.subject,
          html: body.html,
          tags: [
            { name: "email_type", value: "status_update" },
            { name: "invoice_id", value: body.invoice_id },
            { name: "status", value: body.status.toLowerCase() },
          ],
        });
        
        // Handle Resend API errors
        if (error) {
          console.error("Resend API error:", error);
          throw new Error(`Email sending failed: ${error.message}`);
        }
        
        // Return success response with email ID
        return new Response(
          JSON.stringify({
            success: true,
            message: `Status update email sent successfully to ${body.to}`,
            email_id: data?.id,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Email sending error:", error);
        throw error; // Re-throw to be caught by outer try/catch
      }
    } else {
      // For development/mock purposes
      console.log("DEV MODE: Sending mock status update email:", {
        to: body.to,
        subject: body.subject,
        status: body.status,
        from: "Invoy <notifications@invoy.app>",
        invoice_id: body.invoice_id,
      });
      
      console.log("Email HTML content:", body.html.substring(0, 200) + "...");

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock success response
      return new Response(
        JSON.stringify({
          success: true,
          message: `[MOCK] Status update email (${body.status}) sent to ${body.to}`,
          email_id: `mock_${Date.now()}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to send email" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
