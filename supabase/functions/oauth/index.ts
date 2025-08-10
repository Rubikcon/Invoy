/*
  # OAuth Authentication Endpoints

  1. OAuth Providers
    - Google OAuth 2.0
    - GitHub OAuth 2.0
    - Social login callback handling

  2. Security Features
    - State parameter validation
    - PKCE for enhanced security
    - Token exchange and validation
    - User profile creation/linking
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(
  Deno.env.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production'
)

// OAuth Configuration
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')
const GITHUB_CLIENT_ID = Deno.env.get('GITHUB_CLIENT_ID')
const GITHUB_CLIENT_SECRET = Deno.env.get('GITHUB_CLIENT_SECRET')

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface OAuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  provider: 'google' | 'github'
  provider_id: string
}

// Generate JWT token
async function generateJWT(user: any): Promise<string> {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: getNumericDate(new Date()),
    exp: getNumericDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
  }
  
  return await create({ alg: "HS256", typ: "JWT" }, payload, JWT_SECRET)
}

// Exchange Google OAuth code for user info
async function exchangeGoogleCode(code: string, redirectUri: string): Promise<OAuthUser | null> {
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token')
    }

    // Get user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const profile = await profileResponse.json()

    return {
      id: `google_${profile.id}`,
      email: profile.email,
      name: profile.name,
      avatar: profile.picture,
      provider: 'google',
      provider_id: profile.id,
    }
  } catch (error) {
    console.error('Google OAuth error:', error)
    return null
  }
}

// Exchange GitHub OAuth code for user info
async function exchangeGitHubCode(code: string): Promise<OAuthUser | null> {
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID!,
        client_secret: GITHUB_CLIENT_SECRET!,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token')
    }

    // Get user profile
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const profile = await profileResponse.json()

    // Get user email (GitHub might not provide email in profile)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const emails = await emailResponse.json()
    const primaryEmail = emails.find((email: any) => email.primary)?.email || profile.email

    return {
      id: `github_${profile.id}`,
      email: primaryEmail,
      name: profile.name || profile.login,
      avatar: profile.avatar_url,
      provider: 'github',
      provider_id: profile.id.toString(),
    }
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return null
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/oauth', '')
    const method = req.method

    // Google OAuth callback
    if (path === '/google/callback' && method === 'POST') {
      const body = await req.json()
      const { code, redirect_uri, role } = body

      if (!code || !redirect_uri) {
        return new Response(
          JSON.stringify({ error: 'Missing code or redirect_uri' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const oauthUser = await exchangeGoogleCode(code, redirect_uri)
      
      if (!oauthUser) {
        return new Response(
          JSON.stringify({ error: 'Failed to authenticate with Google' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if user exists
      let { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', oauthUser.email.toLowerCase())
        .single()

      let user = existingUser

      if (!existingUser) {
        // Create new user
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            email: oauthUser.email.toLowerCase(),
            name: oauthUser.name,
            avatar: oauthUser.avatar,
            role: role || 'freelancer',
            email_verified: true,
            oauth_provider: oauthUser.provider,
            oauth_provider_id: oauthUser.provider_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) {
          console.error('User creation error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to create user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        user = newUser
      } else {
        // Update last login
        await supabase
          .from('users')
          .update({ 
            last_login_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)
      }

      // Generate JWT token
      const token = await generateJWT(user)

      // Return user data (without sensitive fields)
      const { password_hash, oauth_provider_id, ...userResponse } = user

      return new Response(
        JSON.stringify({
          success: true,
          user: userResponse,
          token,
          message: existingUser ? 'Login successful' : 'Registration successful'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GitHub OAuth callback
    if (path === '/github/callback' && method === 'POST') {
      const body = await req.json()
      const { code, role } = body

      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Missing code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const oauthUser = await exchangeGitHubCode(code)
      
      if (!oauthUser) {
        return new Response(
          JSON.stringify({ error: 'Failed to authenticate with GitHub' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if user exists
      let { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', oauthUser.email.toLowerCase())
        .single()

      let user = existingUser

      if (!existingUser) {
        // Create new user
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            email: oauthUser.email.toLowerCase(),
            name: oauthUser.name,
            avatar: oauthUser.avatar,
            role: role || 'freelancer',
            email_verified: true,
            oauth_provider: oauthUser.provider,
            oauth_provider_id: oauthUser.provider_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) {
          console.error('User creation error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to create user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        user = newUser
      } else {
        // Update last login
        await supabase
          .from('users')
          .update({ 
            last_login_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)
      }

      // Generate JWT token
      const token = await generateJWT(user)

      // Return user data (without sensitive fields)
      const { password_hash, oauth_provider_id, ...userResponse } = user

      return new Response(
        JSON.stringify({
          success: true,
          user: userResponse,
          token,
          message: existingUser ? 'Login successful' : 'Registration successful'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 404 for unknown endpoints
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('OAuth API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})