/*
  # Wallet Authentication API

  1. Endpoints
    - POST /challenge - Generate wallet signature challenge
    - POST /verify - Verify wallet signature
    - POST /link - Link verified wallet to user account
    - GET /wallets - Get user's connected wallets
    - DELETE /wallets/:id - Remove wallet from account

  2. Security Features
    - Signature verification using ethers.js
    - Challenge-response authentication
    - Nonce validation to prevent replay attacks
    - Wallet ownership verification
*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
}

// JWT Secret
const JWT_SECRET = new TextEncoder().encode(
  Deno.env.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production'
)

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

interface ChallengeRequest {
  walletAddress: string
}

interface VerifyRequest {
  walletAddress: string
  signature: string
  message: string
  nonce: string
}

interface LinkWalletRequest {
  walletAddress: string
  network: string
  signature: string
  message: string
  label?: string
}

// Generate cryptographically secure nonce
function generateNonce(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Create challenge message
function createChallengeMessage(walletAddress: string, nonce: string): string {
  const timestamp = new Date().toISOString()
  return `Welcome to Invoy!

Please sign this message to verify your wallet ownership.

Wallet: ${walletAddress}
Timestamp: ${timestamp}
Nonce: ${nonce}

This request will not trigger a blockchain transaction or cost any gas fees.`
}

// Verify JWT token and get user
async function verifyTokenAndGetUser(authHeader: string | null): Promise<any> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header')
  }

  const token = authHeader.substring(7)
  const payload = await verify(token, JWT_SECRET)
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', payload.sub)
    .single()

  if (error || !user) {
    throw new Error('User not found')
  }

  return user
}

// Import ethers for signature verification
import { ethers } from "https://esm.sh/ethers@6.8.1"

// Verify wallet signature with cryptographic methods using EIP-191 standard
async function verifyWalletSignature(signature: string, message: string, expectedAddress: string): Promise<boolean> {
  try {
    // Validate inputs
    if (!signature || !message || !expectedAddress) {
      return false;
    }
    
    // Format the message according to Ethereum's personal_sign standard (EIP-191)
    // This prefixes the message with "\x19Ethereum Signed Message:\n" + message.length
    const formattedMessage = ethers.hashMessage(message);
    
    // Split the signature into components
    if (!signature.startsWith('0x')) {
      signature = '0x' + signature;
    }
    
    // Handle signature recovery - ethers.js recoverAddress expects the message hash and signature
    const recoveredAddress = ethers.recoverAddress(formattedMessage, signature);
    
    // Compare with expected address (case insensitive)
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/wallet-auth', '')
    const method = req.method

    // Generate wallet challenge
    if (path === '/challenge' && method === 'POST') {
      const body: ChallengeRequest = await req.json()
      
      if (!body.walletAddress) {
        return new Response(
          JSON.stringify({ error: 'Wallet address is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const nonce = generateNonce()
      const challengeMessage = createChallengeMessage(body.walletAddress, nonce)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

      // Store challenge in database
      const { data: challenge, error } = await supabase
        .from('wallet_auth_challenges')
        .insert({
          wallet_address: body.walletAddress.toLowerCase(),
          challenge_message: challengeMessage,
          nonce,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to create challenge' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          challenge: {
            id: challenge.id,
            message: challengeMessage,
            nonce,
            expiresAt: expiresAt.toISOString()
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify wallet signature
    if (path === '/verify' && method === 'POST') {
      const body: VerifyRequest = await req.json()
      
      if (!body.walletAddress || !body.signature || !body.message || !body.nonce) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get challenge from database
      const { data: challenge, error } = await supabase
        .from('wallet_auth_challenges')
        .select('*')
        .eq('wallet_address', body.walletAddress.toLowerCase())
        .eq('nonce', body.nonce)
        .eq('is_used', false)
        .gte('expires_at', new Date().toISOString())
        .single()

      if (error || !challenge) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired challenge' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify signature
      const isValidSignature = await verifyWalletSignature(
        body.signature, 
        body.message, 
        body.walletAddress
      )

      if (!isValidSignature) {
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Mark challenge as used
      await supabase
        .from('wallet_auth_challenges')
        .update({ 
          is_used: true, 
          used_at: new Date().toISOString() 
        })
        .eq('id', challenge.id)

      return new Response(
        JSON.stringify({
          success: true,
          verified: true,
          walletAddress: body.walletAddress,
          message: 'Wallet signature verified successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Link verified wallet to user account
    if (path === '/link' && method === 'POST') {
      const user = await verifyTokenAndGetUser(req.headers.get('Authorization'))
      const body: LinkWalletRequest = await req.json()
      
      if (!body.walletAddress || !body.network || !body.signature || !body.message) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify signature first
      const isValidSignature = await verifyWalletSignature(
        body.signature, 
        body.message, 
        body.walletAddress
      )

      if (!isValidSignature) {
        return new Response(
          JSON.stringify({ error: 'Invalid wallet signature' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if wallet is already linked to another user
      const { data: existingWallet } = await supabase
        .from('user_wallets')
        .select('user_id')
        .eq('wallet_address', body.walletAddress.toLowerCase())
        .eq('network', body.network.toLowerCase())
        .single()

      if (existingWallet && existingWallet.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Wallet is already linked to another account' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Link wallet to user
      const { data: wallet, error } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: user.id,
          wallet_address: body.walletAddress.toLowerCase(),
          network: body.network.toLowerCase(),
          is_primary: !existingWallet, // First wallet becomes primary
          is_verified: true,
          consent_given: true,
          consent_date: new Date().toISOString(),
          verification_signature: body.signature,
          verification_message: body.message,
          verification_date: new Date().toISOString(),
          label: body.label || `${body.network} Wallet`,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to link wallet' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          wallet,
          message: 'Wallet linked successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's wallets
    if (path === '/wallets' && method === 'GET') {
      const user = await verifyTokenAndGetUser(req.headers.get('Authorization'))
      
      const { data: wallets, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch wallets' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, wallets }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Remove wallet
    if (path.startsWith('/wallets/') && method === 'DELETE') {
      const user = await verifyTokenAndGetUser(req.headers.get('Authorization'))
      const walletId = path.split('/')[2]
      
      if (!walletId) {
        return new Response(
          JSON.stringify({ error: 'Wallet ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error } = await supabase
        .from('user_wallets')
        .delete()
        .eq('id', walletId)
        .eq('user_id', user.id)

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to remove wallet' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Wallet removed successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 404 for unknown endpoints
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Wallet auth API error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})