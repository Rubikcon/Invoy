/*
  # Authentication API Endpoints

  1. Endpoints
    - POST /auth/register - User registration with email/password
    - POST /auth/login - User login with email/password
    - POST /auth/refresh - Refresh JWT token
    - POST /auth/logout - User logout
    - GET /auth/me - Get current user profile
    - PUT /auth/profile - Update user profile

  2. Security Features
    - Password hashing with bcrypt
    - JWT token generation and validation
    - Rate limiting for auth endpoints
    - Input validation and sanitization
    - CORS handling
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"
import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
}

// JWT Secret (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(
  Deno.env.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production'
)

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface User {
  id: string
  email: string
  name: string
  role: 'freelancer' | 'employer'
  avatar?: string
  wallet_address?: string
  created_at: string
  updated_at: string
  email_verified: boolean
}

interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'freelancer' | 'employer'
}

interface LoginRequest {
  email: string
  password: string
}

// Generate JWT token
async function generateJWT(user: User): Promise<{ accessToken: string; refreshToken: string }> {
  const now = new Date()
  const accessTokenExpiry = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes
  const refreshTokenExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  // Access token payload
  const accessPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
    iat: getNumericDate(now),
    exp: getNumericDate(accessTokenExpiry),
  }

  // Refresh token payload
  const refreshPayload = {
    sub: user.id,
    email: user.email,
    type: 'refresh',
    iat: getNumericDate(now),
    exp: getNumericDate(refreshTokenExpiry),
  }

  const accessToken = await create({ alg: "HS256", typ: "JWT" }, accessPayload, JWT_SECRET)
  const refreshToken = await create({ alg: "HS256", typ: "JWT" }, refreshPayload, JWT_SECRET)

  return { accessToken, refreshToken }
}

// Generate refresh token
async function generateRefreshToken(user: User): Promise<string> {
  const payload = {
    sub: user.id,
    email: user.email,
    type: 'refresh',
    iat: getNumericDate(new Date()),
    exp: getNumericDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
  }
  
  return await create({ alg: "HS256", typ: "JWT" }, payload, JWT_SECRET)
}

// Verify JWT token
async function verifyJWT(token: string): Promise<any> {
  try {
    return await verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
function isValidPassword(password: string): boolean {
  return password.length >= 6
}

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, maxRequests = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const key = `auth:${ip}`
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxRequests) {
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
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/auth', '')
    const method = req.method
    
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting for auth endpoints
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Register endpoint
    if (path === '/register' && method === 'POST') {
      const body: RegisterRequest = await req.json()
      
      // Validation
      if (!body.name || !body.email || !body.password || !body.role) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (!isValidEmail(body.email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (!isValidPassword(body.password)) {
        return new Response(
          JSON.stringify({ error: 'Password must be at least 6 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (!['freelancer', 'employer'].includes(body.role)) {
        return new Response(
          JSON.stringify({ error: 'Invalid role' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', body.email.toLowerCase())
        .single()

      if (existingUser) {
        return new Response(
          JSON.stringify({ error: 'User already exists with this email' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(body.password)

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          name: body.name.trim(),
          email: body.email.toLowerCase(),
          password_hash: hashedPassword,
          role: body.role,
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Registration error:', error)
        return new Response(
          JSON.stringify({ error: 'Registration failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Generate JWT token
      const tokens = await generateJWT(user)

      // Return user data (without password hash)
      const { password_hash, ...userResponse } = user
      
      return new Response(
        JSON.stringify({
          success: true,
          user: userResponse,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          message: 'Registration successful'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Login endpoint
    if (path === '/login' && method === 'POST') {
      const body: LoginRequest = await req.json()
      
      // Validation
      if (!body.email || !body.password) {
        return new Response(
          JSON.stringify({ error: 'Email and password are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', body.email.toLowerCase())
        .single()

      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid email or password' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(body.password, user.password_hash)
      
      if (!isValidPassword) {
        return new Response(
          JSON.stringify({ error: 'Invalid email or password' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update last login
      await supabase
        .from('users')
        .update({ 
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      // Generate JWT token
      const tokens = await generateJWT(user)

      // Return user data (without password hash)
      const { password_hash, ...userResponse } = user
      
      return new Response(
        JSON.stringify({
          success: true,
          user: userResponse,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          message: 'Login successful'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current user profile
    if (path === '/me' && method === 'GET') {
      const authHeader = req.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'Missing or invalid authorization header' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.substring(7)
      
      try {
        const payload = await verifyJWT(token)
        
        // Get user from database
        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, name, role, avatar, wallet_address, created_at, updated_at, email_verified, last_login_at')
          .eq('id', payload.sub)
          .single()

        if (error || !user) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, user }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update user profile
    if (path === '/profile' && method === 'PUT') {
      const authHeader = req.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'Missing or invalid authorization header' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.substring(7)
      
      try {
        const payload = await verifyJWT(token)
        const body = await req.json()
        
        // Validate allowed fields
        const allowedFields = ['name', 'avatar', 'wallet_address']
        const updates: any = { updated_at: new Date().toISOString() }
        
        for (const field of allowedFields) {
          if (body[field] !== undefined) {
            updates[field] = body[field]
          }
        }

        // Update user in database
        const { data: user, error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', payload.sub)
          .select('id, email, name, role, avatar, wallet_address, created_at, updated_at, email_verified, last_login_at')
          .single()

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to update profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, user, message: 'Profile updated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Refresh token endpoint
    if (path === '/refresh' && method === 'POST') {
      const body = await req.json()
      const refreshToken = body.refreshToken
      
      if (!refreshToken) {
        return new Response(
          JSON.stringify({ error: 'Missing refresh token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      try {
        const payload = await verifyJWT(refreshToken)
        
        // Verify it's a refresh token
        if (payload.type !== 'refresh') {
          throw new Error('Invalid token type')
        }
        
        // Get user from database
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', payload.sub)
          .single()

        if (error || !user) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Generate new access token
        const tokens = await generateJWT(user)

        return new Response(
          JSON.stringify({ 
            success: true, 
            token: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Logout endpoint (client-side token invalidation)
    if (path === '/logout' && method === 'POST') {
      return new Response(
        JSON.stringify({ success: true, message: 'Logged out successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 404 for unknown endpoints
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Auth API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})