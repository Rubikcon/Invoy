// Resend Email Service for reliable email delivery
// Documentation: https://resend.com/docs/send-with-nodejs

// Types for Resend email service responses
export interface ResendEmailResponse {
  id?: string;
  success?: boolean;
  error?: ResendError;
}

export interface ResendError {
  message: string;
  statusCode: number;
}

// Email data interface
export interface ResendEmailData {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
}

// Invoice email interface
export interface InvoiceEmailData {
  to: string;
  invoiceId: string;
  invoiceLink: string;
  freelancerName: string;
  freelancerEmail: string;
  amount: string;
  network: string;
  description: string;
}

// Status update email interface
export interface StatusUpdateEmailData {
  freelancerEmail: string;
  freelancerName: string;
  invoiceId: string;
  status: 'Approved' | 'Rejected' | 'Paid';
  employerEmail: string;
  amount: string;
  rejectionReason?: string;
}

class ResendService {
  private apiKey: string;
  private apiUrl: string = 'https://api.resend.com/emails';
  private defaultSender: string = 'Invoy <invoices@invoy.app>';

  constructor() {
    // Use the API key from environment variables
    this.apiKey = import.meta.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || 're_ZZ7MiDeK_NpskHF388TiKZTgQum99zc1x';
  }

  // Set API key (useful for testing or dynamic key management)
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Set default sender email
  setDefaultSender(sender: string): void {
    this.defaultSender = sender;
  }

  // Send email using Resend API
  async sendEmail(emailData: Partial<ResendEmailData>): Promise<ResendEmailResponse> {
    try {
      // Ensure required fields are present
      if (!emailData.to || (!emailData.html && !emailData.text)) {
        throw new Error('Missing required email fields: to, and either html or text');
      }

      // Use default sender if not provided
      const completeEmailData = {
        from: this.defaultSender,
        ...emailData,
      };

      // For development/demo purposes, log the email - but now we'll send a real email too
      // since we have a valid API key
      if (import.meta.env.DEV) {
        console.log('📧 EMAIL SENDING with Resend:', completeEmailData);
      }

      // Make API request to Resend
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(completeEmailData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: {
            message: data.message || 'Failed to send email',
            statusCode: response.status,
          },
        };
      }

      return { id: data.id };
    } catch (error) {
      console.error('Error sending email via Resend:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error sending email',
          statusCode: 500,
        },
      };
    }
  }

  // Generate an HTML email from template parts
  generateHtmlEmail({
    title,
    content,
    buttonText,
    buttonUrl,
    footerText
  }: {
    title: string;
    content: string;
    buttonText?: string;
    buttonUrl?: string;
    footerText?: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://invoy.app/logo.png" alt="Invoy Logo" style="height: 40px;" />
        </div>
        <h2 style="color: #1f2937;">${title}</h2>
        <div style="margin: 20px 0;">
          ${content}
        </div>
        ${buttonText && buttonUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${buttonUrl}" 
              style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
              ${buttonText}
            </a>
          </div>
        ` : ''}
        ${footerText ? `
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            ${footerText}
          </p>
        ` : ''}
      </div>
    `;
  }

  // Generate invoice email content
  private generateInvoiceEmailContent(data: InvoiceEmailData): string {
    const content = `
      <p>Hi,</p>
      <p>I've completed the work and created an invoice for your review. Please click the button below to review and approve the payment.</p>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4b5563;">Invoice Details:</h3>
        <ul style="padding-left: 20px; color: #4b5563;">
          <li>Invoice ID: ${data.invoiceId}</li>
          <li>Amount: ${data.amount} ${data.network === 'Ethereum' ? 'ETH' : data.network}</li>
          <li>Network: ${data.network}</li>
          <li>Description: ${data.description}</li>
        </ul>
      </div>
      <p>The invoice includes all necessary payment information and has been verified for the correct network and wallet address.</p>
      <p>Best regards,<br>${data.freelancerName}<br>${data.freelancerEmail}</p>
    `;

    return this.generateHtmlEmail({
      title: `Invoice ${data.invoiceId} - Payment Request`,
      content,
      buttonText: 'View & Approve Invoice',
      buttonUrl: data.invoiceLink,
      footerText: '© Invoy - Web3 Invoicing Platform. All rights reserved.'
    });
  }

  // Generate status update email content
  private generateStatusUpdateEmailContent(data: StatusUpdateEmailData): string {
    const statusMessage = data.status === 'Approved' 
      ? `Great news! Your invoice has been approved and payment is being processed.`
      : data.status === 'Paid'
        ? `Great news! Your invoice has been paid. The transaction has been completed successfully.`
        : `Your invoice has been rejected. ${data.rejectionReason ? `Reason: ${data.rejectionReason}` : ''}`;
    
    const content = `
      <p>Hi ${data.freelancerName},</p>
      <p>${statusMessage}</p>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #4b5563;">Invoice Details:</h3>
        <ul style="padding-left: 20px; color: #4b5563;">
          <li>Invoice ID: ${data.invoiceId}</li>
          <li>Amount: ${data.amount}</li>
          <li>Status: <span style="color: ${
            data.status === 'Approved' ? '#10b981' : 
            data.status === 'Paid' ? '#3b82f6' : 
            '#ef4444'
          }; font-weight: bold;">${data.status}</span></li>
          <li>Employer: ${data.employerEmail}</li>
          ${data.rejectionReason ? `<li>Rejection Reason: ${data.rejectionReason}</li>` : ''}
        </ul>
      </div>
      <p>${data.status === 'Approved' 
        ? 'You should receive your payment shortly. Thank you for your work!'
        : data.status === 'Paid'
          ? 'Thank you for using Invoy for your invoicing needs!'
          : 'Please review the feedback and feel free to create a new invoice if needed.'
      }</p>
      <p>Best regards,<br>Invoy Team</p>
    `;

    return this.generateHtmlEmail({
      title: `Invoice ${data.invoiceId} ${data.status} - Status Update`,
      content,
      buttonText: data.status !== 'Rejected' ? 'View Invoice' : undefined,
      buttonUrl: data.status !== 'Rejected' ? `https://invoy.app/invoices/${data.invoiceId}` : undefined,
      footerText: '© Invoy - Web3 Invoicing Platform. All rights reserved.'
    });
  }

  // Send invoice email
  async sendInvoiceEmail(data: InvoiceEmailData): Promise<ResendEmailResponse> {
    const html = this.generateInvoiceEmailContent(data);
    
    const response = await this.sendEmail({
      to: data.to,
      subject: `Invoice ${data.invoiceId} - Payment Request from ${data.freelancerName}`,
      html,
      reply_to: data.freelancerEmail,
      tags: [
        { name: 'email_type', value: 'invoice' },
        { name: 'invoice_id', value: data.invoiceId }
      ]
    });

    return {
      ...response,
      success: !!response.id && !response.error
    };
  }

  // Send status update email
  async sendStatusUpdateEmail(data: StatusUpdateEmailData): Promise<ResendEmailResponse> {
    const html = this.generateStatusUpdateEmailContent(data);
    
    const response = await this.sendEmail({
      to: data.freelancerEmail,
      subject: `Invoice ${data.invoiceId} ${data.status} - Status Update`,
      html,
      tags: [
        { name: 'email_type', value: 'status_update' },
        { name: 'invoice_id', value: data.invoiceId },
        { name: 'status', value: data.status.toLowerCase() }
      ]
    });

    return {
      ...response,
      success: !!response.id && !response.error
    };
  }
}

export const resendService = new ResendService();
export default resendService;