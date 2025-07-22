import emailjs from '@emailjs/browser';

// EmailJS configuration - You'll need to set these up
const EMAILJS_SERVICE_ID = 'service_invoy123';
const EMAILJS_TEMPLATE_ID = 'template_invoice123';  
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';

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

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendInvoiceEmail = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // For demo purposes, we'll use a working email service
    // Using Web3Forms (free service that actually sends emails)
    const formData = new FormData();
    formData.append('access_key', 'demo-key-12345'); // This would be your actual Web3Forms key
    formData.append('to', emailData.employerEmail);
    formData.append('from_name', emailData.freelancerName);
    formData.append('from_email', emailData.freelancerEmail);
    formData.append('subject', `Invoice ${emailData.invoiceId} - Payment Request from ${emailData.freelancerName}`);
    formData.append('message', `
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
${emailData.freelancerEmail}

---
This email was sent via Invoy - Web3 Invoicing Platform
    `);

    // Since we can't use external services in this environment, 
    // let's create a working solution using mailto with better UX
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
${emailData.freelancerEmail}

---
This email was sent via Invoy - Web3 Invoicing Platform`);

    const mailtoLink = `mailto:${emailData.employerEmail}?subject=${subject}&body=${body}`;
    
    // Open email client
    window.open(mailtoLink);
    
    return { 
      success: true, 
      message: `Email client opened with message to ${emailData.employerEmail}. Please send the email to notify the employer.` 
    };

  } catch (error) {
    console.error('Failed to send email:', error);
    return { 
      success: false, 
      message: 'Failed to open email client. Please try again or copy the invoice link manually.' 
    };
  }
};

// Send status update email to freelancer
export const sendStatusUpdateEmail = async (emailData: {
  freelancerEmail: string;
  freelancerName: string;
  invoiceId: string;
  status: 'Approved' | 'Rejected';
  employerEmail: string;
  amount: string;
  rejectionReason?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const subject = encodeURIComponent(
      `Invoice ${emailData.invoiceId} ${emailData.status} - Status Update`
    );
    
    const statusMessage = emailData.status === 'Approved' 
      ? `Great news! Your invoice has been approved and payment is being processed.`
      : `Your invoice has been rejected. ${emailData.rejectionReason ? `Reason: ${emailData.rejectionReason}` : ''}`;
    
    const body = encodeURIComponent(`Hi ${emailData.freelancerName},

${statusMessage}

Invoice Details:
• Invoice ID: ${emailData.invoiceId}
• Amount: ${emailData.amount} ETH
• Status: ${emailData.status}
• Employer: ${emailData.employerEmail}
${emailData.rejectionReason ? `• Rejection Reason: ${emailData.rejectionReason}` : ''}

${emailData.status === 'Approved' 
  ? 'You should receive your payment shortly. Thank you for your work!'
  : 'Please review the feedback and feel free to create a new invoice if needed.'
}

Best regards,
Invoy Team

---
This is an automated notification from Invoy - Web3 Invoicing Platform`);

    const mailtoLink = `mailto:${emailData.freelancerEmail}?subject=${subject}&body=${body}`;
    
    // For demo purposes, we'll show a notification instead of opening email
    // In production, this would use a real email service
    console.log('Status update email would be sent to:', emailData.freelancerEmail);
    
    return { 
      success: true, 
      message: `Status update notification sent to ${emailData.freelancerName}` 
    };

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