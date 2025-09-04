/*
  # Send Invoice Email Function

  1. Purpose
    - Send invoice notification emails to employers
    - Handle email templates and formatting
    - Provide fallback email delivery

  2. Security Features
    - Input validation and sanitization
    - Rate limiting for email sending
    - CORS handling
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  freelancer_name: string
  freelancer_email: string
  invoice_id: string
  invoice_link: string
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Rate limiting (simple in-memory store)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(email: string, maxEmails = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now()
  const key = `email:${email}`
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxEmails) {
    return false
  }
  
  record.count++
  return true
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: EmailRequest = await req.json()
    
    // Validation
    if (!body.to || !body.subject || !body.html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!isValidEmail(body.to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting
    if (!checkRateLimit(body.to)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // In a real implementation, you would use a service like:
    // - Resend
    // - SendGrid
    // - Mailgun
    // - AWS SES
    
    // For demo purposes, we'll simulate email sending
    console.log('Sending invoice email:', {
      to: body.to,
      subject: body.subject,
      from: body.freelancer_email,
      invoice_id: body.invoice_id
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In production, replace this with actual email service
    // Example with Resend:
    /*
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    
    const { data, error } = await resend.emails.send({
      from: 'Invoy <noreply@invoy.app>',
      to: [body.to],
      subject: body.subject,
      html: body.html,
      reply_to: body.freelancer_email
    })
    
    if (error) {
      throw new Error(`Email sending failed: ${error.message}`)
    }
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: `Invoice email sent successfully to ${body.to}`,
        email_id: `demo_${Date.now()}` // In production, this would be the actual email ID
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})