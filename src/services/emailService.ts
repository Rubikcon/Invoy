import emailjs from 'emailjs-com';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_invoy'; // You'll need to replace this
const EMAILJS_TEMPLATE_ID = 'template_invoice'; // You'll need to replace this  
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // You'll need to replace this

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

export const sendInvoiceEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: emailData.employerEmail,
      from_name: emailData.freelancerName,
      from_email: emailData.freelancerEmail,
      invoice_id: emailData.invoiceId,
      amount: emailData.amount,
      network: emailData.network,
      description: emailData.description,
      invoice_link: emailData.invoiceLink,
      subject: `Invoice ${emailData.invoiceId} - Payment Request from ${emailData.freelancerName}`,
      message: `Hi,

I've completed the work and created an invoice for your review. Please click the link below to review and approve the payment:

${emailData.invoiceLink}

Invoice Details:
- Invoice ID: ${emailData.invoiceId}
- Amount: ${emailData.amount} ETH
- Network: ${emailData.network}
- Description: ${emailData.description}

The invoice includes all necessary payment information and has been verified for the correct network and wallet address.

Best regards,
${emailData.freelancerName}
${emailData.freelancerEmail}`
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Alternative: Simple mailto fallback
export const openEmailClient = (emailData: EmailData): void => {
  const subject = encodeURIComponent(`Invoice ${emailData.invoiceId} - Payment Request from ${emailData.freelancerName}`);
  const body = encodeURIComponent(`Hi,

I've completed the work and created an invoice for your review. Please click the link below to review and approve the payment:

${emailData.invoiceLink}

Invoice Details:
- Invoice ID: ${emailData.invoiceId}
- Amount: ${emailData.amount} ETH
- Network: ${emailData.network}
- Description: ${emailData.description}

The invoice includes all necessary payment information and has been verified for the correct network and wallet address.

Best regards,
${emailData.freelancerName}
${emailData.freelancerEmail}`);

  const mailtoLink = `mailto:${emailData.employerEmail}?subject=${subject}&body=${body}`;
  window.open(mailtoLink);
};