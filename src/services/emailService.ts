import resendService from './resendService';

export interface EmailData {
  employerEmail: string;
  freelancerName: string;
  freelancerEmail: string;
  invoiceId: string;
  amount: string;
  network: string;
  description: string;
  invoiceLink: string;
}

export const sendInvoiceEmail = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Log the sending attempt for debugging
    console.log(`Attempting to send invoice email to ${emailData.employerEmail}...`);
    
    // Use Resend service for professional email delivery
    const response = await resendService.sendInvoiceEmail({
      to: emailData.employerEmail,
      invoiceId: emailData.invoiceId,
      invoiceLink: emailData.invoiceLink,
      freelancerName: emailData.freelancerName,
      freelancerEmail: emailData.freelancerEmail,
      amount: emailData.amount,
      network: emailData.network,
      description: emailData.description
    });

    // If Resend was successful
    if (response.success) {
      console.log(`Email sent successfully via Resend with ID: ${response.id}`);
      
      // In development mode, provide more detailed logging
      if (import.meta.env.DEV) {
        console.log('Email details:', {
          to: emailData.employerEmail,
          from: emailData.freelancerEmail,
          invoiceId: emailData.invoiceId,
          network: emailData.network,
          amount: emailData.amount
        });
        
        // No need to offer mailto: links anymore since we have a real API key
        console.log(`📧 Real email sent to ${emailData.employerEmail} using Resend API`);
      }

      return { 
        success: true, 
        message: `Email sent to ${emailData.employerEmail} successfully.` 
      };
    } else {
      // If Resend fails, log the error and provide more information
      console.error('Resend email failed:', response.error);
      
      // Only fall back to mailto link if we're in development mode or the error is severe
      if (import.meta.env.DEV || (response.error && response.error.statusCode >= 500)) {
        console.warn('Falling back to mailto link due to API failure');
        
        const subject = `Invoice ${emailData.invoiceId} - Payment Request from ${emailData.freelancerName}`;
        const body = `Hi,

I've completed the work and created an invoice for your review. Please click the link below to review and approve the payment:

${emailData.invoiceLink}

Invoice Details:
• Invoice ID: ${emailData.invoiceId}
• Amount: ${emailData.amount} ETH
• Network: ${emailData.network}
• Description: ${emailData.description}

The invoice includes all necessary payment information and has been verified for the correct network and wallet address.

Best regards,
${emailData.freelancerName}
${emailData.freelancerEmail}

---
This email was sent via Invoy - Web3 Invoicing Platform`;

        try {
          window.open(`mailto:${emailData.employerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          return { 
            success: true, 
            message: `Email service encountered an issue, but we've opened an email client for you as a backup. Please send the email manually.` 
          };
        } catch (windowErr) {
          console.error('Could not open mailto link:', windowErr);
          return {
            success: false,
            message: 'Email delivery failed. Please try again or contact support if the issue persists.'
          };
        }
      } else {
        // For less severe errors, just return an appropriate message without trying mailto
        return {
          success: false,
          message: `Email delivery failed: ${response.error?.message || 'Unknown error'}. Please try again.`
        };
      }
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    
    // Only try mailto as fallback in development environment
    if (import.meta.env.DEV) {
      try {
        // Use a simplified email for the fallback case
        const subject = `Invoice ${emailData.invoiceId} - Payment Request from ${emailData.freelancerName}`;
        const body = `Hi,\n\nI've completed the work and created an invoice for your review: ${emailData.invoiceLink}\n\nBest regards,\n${emailData.freelancerName}`;
        window.open(`mailto:${emailData.employerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        
        return {
          success: false,
          message: 'Email service error. Email client opened as fallback. Please send the email manually.'
        };
      } catch (finalError) {
        console.error('Final fallback failed:', finalError);
      }
    }
    
    // Provide a message with the invoice link for manual sharing
    return { 
      success: false, 
      message: `Email service unavailable. Please copy this invoice link and share it manually: ${emailData.invoiceLink}` 
    };
    
    // Last resort fallback to mailto
    try {
      const subject = encodeURIComponent(`Invoice ${emailData.invoiceId} - Payment Request from ${emailData.freelancerName}`);
      const body = encodeURIComponent(`Hi,

I've completed the work and created an invoice for your review. Please click the link below to review and approve the payment:

${emailData.invoiceLink}

Invoice Details:
• Invoice ID: ${emailData.invoiceId}
• Amount: ${emailData.amount} ETH
• Network: ${emailData.network}
• Description: ${emailData.description}

The invoice includes all necessary payment information and has been verified for the correct network and wallet address.

Best regards,
${emailData.freelancerName}
${emailData.freelancerEmail}`);

      const mailtoLink = `mailto:${emailData.employerEmail}?subject=${subject}&body=${body}`;
      window.open(mailtoLink);
      
      return { 
        success: true, 
        message: 'Email client opened as fallback. Please send the email to notify the employer.' 
      };
    } catch (mailtoError) {
      return { 
        success: false, 
        message: 'Failed to send email. Please try again or copy the invoice link manually.' 
      };
    }
  }
};

// Send status update email to freelancer
export const sendStatusUpdateEmail = async (emailData: {
  freelancerEmail: string;
  freelancerName: string;
  invoiceId: string;
  status: 'Approved' | 'Rejected' | 'Paid';
  employerEmail: string;
  amount: string;
  rejectionReason?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Sending ${emailData.status} status update email to ${emailData.freelancerName} (${emailData.freelancerEmail})`);

    // Use the Resend service to send a professional email
    const response = await resendService.sendStatusUpdateEmail({
      freelancerEmail: emailData.freelancerEmail,
      freelancerName: emailData.freelancerName,
      invoiceId: emailData.invoiceId,
      status: emailData.status,
      employerEmail: emailData.employerEmail,
      amount: emailData.amount,
      rejectionReason: emailData.rejectionReason
    });

    if (response.success) {
      console.log(`Status update email sent successfully via Resend with ID: ${response.id}`);
      
      // Add more detailed logging in development mode
      if (import.meta.env.DEV) {
        console.log('Status update email details:', {
          to: emailData.freelancerEmail,
          invoiceId: emailData.invoiceId,
          status: emailData.status,
          amount: emailData.amount
        });
      }
      
      return { 
        success: true, 
        message: `Status update notification sent to ${emailData.freelancerName}` 
      };
    } else {
      // If Resend fails, log the error
      console.error('Resend status update email failed:', response.error);
      
      // Only use fallback in development or for severe errors
      if (import.meta.env.DEV || (response.error && response.error.statusCode >= 500)) {
        console.warn('Using fallback method for status update email');
        
        // Prepare fallback email content
        const subject = `Invoice ${emailData.invoiceId} ${emailData.status} - Status Update`;
        
        const statusMessage = emailData.status === 'Approved' 
          ? `Great news! Your invoice has been approved and payment is being processed.`
          : emailData.status === 'Paid'
            ? `Great news! Your invoice has been paid. The transaction has been completed successfully.`
            : `Your invoice has been rejected. ${emailData.rejectionReason ? `Reason: ${emailData.rejectionReason}` : ''}`;
        
        const body = `Hi ${emailData.freelancerName},

${statusMessage}

Invoice Details:
• Invoice ID: ${emailData.invoiceId}
• Amount: ${emailData.amount} ETH
• Status: ${emailData.status}
• Employer: ${emailData.employerEmail}
${emailData.rejectionReason ? `• Rejection Reason: ${emailData.rejectionReason}` : ''}

${emailData.status === 'Approved' 
  ? 'You should receive your payment shortly. Thank you for your work!'
  : emailData.status === 'Paid'
    ? 'Thank you for using Invoy for your invoicing needs!'
    : 'Please review the feedback and feel free to create a new invoice if needed.'
}

Best regards,
Invoy Team

---
This is an automated notification from Invoy - Web3 Invoicing Platform`;

        try {
          // Try to open the email client as a fallback method
          window.open(`mailto:${emailData.freelancerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          console.log('Opened email client as fallback');
          
          return { 
            success: true, 
            message: `Status update notification initiated through email client (fallback method)` 
          };
        } catch (windowErr) {
          console.warn('Could not open mailto link:', windowErr);
        }
      }
      
      // For both development and production, return an appropriate error message
      return { 
        success: false, 
        message: `Could not send status update email: ${response.error?.message || 'Unknown error'}` 
      };
    }
  } catch (error) {
    console.error('Failed to send status update email:', error);
    return { 
      success: false, 
      message: 'Failed to send status update notification.' 
    };
  }
};

// Alternative: Copy to clipboard function
export const copyInvoiceDetails = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    const emailContent = `To: ${emailData.employerEmail}
Subject: Invoice ${emailData.invoiceId} - Payment Request from ${emailData.freelancerName}

Hi,

I've completed the work and created an invoice for your review. Please click the link below to review and approve the payment:

${emailData.invoiceLink}

Invoice Details:
• Invoice ID: ${emailData.invoiceId}
• Amount: ${emailData.amount} ETH
• Network: ${emailData.network}
• Description: ${emailData.description}

The invoice includes all necessary payment information and has been verified for the correct network and wallet address.

Best regards,
${emailData.freelancerName}
${emailData.freelancerEmail}`;

    await navigator.clipboard.writeText(emailContent);
    return { 
      success: true, 
      message: 'Email content copied to clipboard! You can paste it into any email client.' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Failed to copy to clipboard.' 
    };
  }
};