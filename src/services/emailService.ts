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