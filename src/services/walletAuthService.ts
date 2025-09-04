// Wallet Authentication Service for signature verification and wallet login
import { WalletAuthChallenge } from '../types';
import { EthereumProvider } from '../types/ethereum';

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export interface WalletSignatureResult {
  signature: string;
  message: string;
  address: string;
}

export interface WalletAuthUser {
  walletAddress: string;
}

export interface WalletAuthResult {
  success: boolean;
  message: string;
  user?: WalletAuthUser;
  challenge?: WalletAuthChallenge;
}

class WalletAuthService {
  private readonly CHALLENGE_EXPIRY = 5 * 60 * 1000; // 5 minutes
  private readonly STORAGE_KEY = 'invoy_wallet_challenges';

  // Generate authentication challenge for wallet
  generateChallenge(walletAddress: string): WalletAuthChallenge {
    const nonce = this.generateNonce();
    const challengeMessage = this.createChallengeMessage(walletAddress, nonce);
    
    const challenge: WalletAuthChallenge = {
      id: `challenge_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      walletAddress: walletAddress.toLowerCase(),
      challengeMessage,
      nonce,
      expiresAt: new Date(Date.now() + this.CHALLENGE_EXPIRY),
      isUsed: false,
      createdAt: new Date()
    };

    // Store challenge locally (in production, this would be stored in backend)
    this.storeChallenge(challenge);
    
    return challenge;
  }

  // Create challenge message for signing
  private createChallengeMessage(walletAddress: string, nonce: string): string {
    const timestamp = new Date().toISOString();
    return `Welcome to Invoy!

Please sign this message to verify your wallet ownership.

Wallet: ${walletAddress}
Timestamp: ${timestamp}
Nonce: ${nonce}

This request will not trigger a blockchain transaction or cost any gas fees.`;
  }

  // Generate cryptographically secure nonce
  private generateNonce(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Store challenge in localStorage (in production, use backend)
  private storeChallenge(challenge: WalletAuthChallenge): void {
    try {
      const challenges = this.getChallenges();
      challenges.push({
        ...challenge,
        expiresAt: challenge.expiresAt.toISOString(),
        createdAt: challenge.createdAt.toISOString(),
        usedAt: challenge.usedAt?.toISOString()
      });
      
      // Clean up expired challenges
      const validChallenges = challenges.filter(c => 
        new Date(c.expiresAt) > new Date() && !c.isUsed
      );
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validChallenges));
    } catch (error) {
      console.error('Error storing challenge:', error);
    }
  }

  // Get stored challenges
  private getChallenges(): any[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading challenges:', error);
      return [];
    }
  }

  // Request wallet signature
  async requestWalletSignature(walletAddress: string): Promise<WalletSignatureResult | null> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Generate challenge
      const challenge = this.generateChallenge(walletAddress);
      
      // Request signature from wallet
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [challenge.challengeMessage, walletAddress],
      });

      return {
        signature,
        message: challenge.challengeMessage,
        address: walletAddress
      };
    } catch (error: any) {
      console.error('Wallet signature error:', error);
      if (error.code === 4001) {
        throw new Error('User rejected the signature request');
      }
      throw new Error('Failed to sign message with wallet');
    }
  }

  // Verify wallet signature using cryptographic methods
  async verifyWalletSignature(
    signature: string, 
    message: string, 
    expectedAddress: string
  ): Promise<{ isValid: boolean; recoveredAddress?: string }> {
    try {
      // Basic validation
      if (!signature || !message || !expectedAddress) {
        return { isValid: false };
      }

      // Import ethers dynamically to avoid SSR issues
      const { ethers } = await import('ethers');
      
      // Recover the address from the signature
      const msgUtf8 = new TextEncoder().encode(message);
      const msgHex = '0x' + Array.from(msgUtf8).map(b => b.toString(16).padStart(2, '0')).join('');
      const msgHash = ethers.keccak256(msgHex);
      
      // Recover the address that signed the message
      const recoveredAddress = ethers.recoverAddress(msgHash, signature);
      
      // Compare with expected address (case insensitive)
      const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
      
      return {
        isValid,
        recoveredAddress: isValid ? recoveredAddress : undefined
      };
    } catch (error) {
      console.error('Signature verification error:', error);
      return { isValid: false };
    }
  }

  // Authenticate user with wallet signature
  async authenticateWithWallet(walletAddress: string): Promise<WalletAuthResult> {
    try {
      // Request signature
      const signatureResult = await this.requestWalletSignature(walletAddress);
      
      if (!signatureResult) {
        return { success: false, message: 'Failed to get wallet signature' };
      }

      // Verify signature
      const verification = await this.verifyWalletSignature(
        signatureResult.signature,
        signatureResult.message,
        walletAddress
      );

      if (!verification.isValid) {
        return { success: false, message: 'Invalid wallet signature' };
      }

      // Mark challenge as used
      this.markChallengeAsUsed(walletAddress);

      return {
        success: true,
        message: 'Wallet authentication successful',
        user: { walletAddress: verification.recoveredAddress }
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Wallet authentication failed' };
    }
  }

  // Mark challenge as used
  private markChallengeAsUsed(walletAddress: string): void {
    try {
      const challenges = this.getChallenges();
      const updatedChallenges = challenges.map(c => 
        c.walletAddress === walletAddress.toLowerCase() && !c.isUsed
          ? { ...c, isUsed: true, usedAt: new Date().toISOString() }
          : c
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedChallenges));
    } catch (error) {
      console.error('Error marking challenge as used:', error);
    }
  }

  // Get wallet verification status
  getWalletVerificationStatus(walletAddress: string): {
    isVerified: boolean;
    verificationDate?: Date;
    consentGiven: boolean;
  } {
    // In production, this would query the backend
    // For demo, we'll check localStorage
    try {
      const wallets = JSON.parse(localStorage.getItem('invoy_user_wallets') || '[]');
      const wallet = wallets.find((w: any) => 
        w.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      );
      
      return {
        isVerified: wallet?.isVerified || false,
        verificationDate: wallet?.verificationDate ? new Date(wallet.verificationDate) : undefined,
        consentGiven: wallet?.consentGiven || false
      };
    } catch (error) {
      return { isVerified: false, consentGiven: false };
    }
  }

  // Store wallet with user consent
  async storeWalletWithConsent(
    userId: string,
    walletAddress: string,
    network: string,
    signature?: string,
    message?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const walletData = {
        id: `wallet_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        userId,
        walletAddress: walletAddress.toLowerCase(),
        network,
        isPrimary: true, // First wallet is primary
        isVerified: !!signature,
        consentGiven: true,
        consentDate: new Date().toISOString(),
        verificationSignature: signature,
        verificationMessage: message,
        verificationDate: signature ? new Date().toISOString() : undefined,
        label: `${network} Wallet`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store in localStorage (in production, this would be stored in backend)
      const wallets = JSON.parse(localStorage.getItem('invoy_user_wallets') || '[]');
      
      // Remove existing wallet for same address/network
      const filteredWallets = wallets.filter((w: any) => 
        !(w.walletAddress.toLowerCase() === walletAddress.toLowerCase() && w.network === network)
      );
      
      filteredWallets.push(walletData);
      localStorage.setItem('invoy_user_wallets', JSON.stringify(filteredWallets));

      return { success: true, message: 'Wallet stored successfully with user consent' };
    } catch (error) {
      console.error('Error storing wallet:', error);
      return { success: false, message: 'Failed to store wallet information' };
    }
  }
}

export const walletAuthService = new WalletAuthService();
export default walletAuthService;