import { Invoice, CreateInvoiceData } from '../types';

/**
 * Consistently sanitizes and maps the application invoice data to a format
 * ready to be sent to the backend.
 */
export function sanitizeInvoiceData(data: CreateInvoiceData, userId?: string): Record<string, any> {
  return {
    ...(userId ? { user_id: userId } : {}),
    employer_email: (data.employerEmail || '').trim().toLowerCase(),
    freelancer_name: (data.fullName || '').trim(),
    freelancer_email: (data.email || '').trim().toLowerCase(),
    wallet_address: (data.walletAddress || '').trim().toLowerCase(),
    network: (data.network || '').trim().toLowerCase(),
    token: (data.token || '').trim().toUpperCase(),
    amount: parseFloat(data.amount) || 0,
    role: (data.role || '').trim(),
    description: (data.description || '').trim(),
    description_html: data.descriptionHtml,
  };
}

/**
 * Consistently sanitizes invoice fields in the returned invoice object
 */
export function sanitizeInvoiceOutput(invoice: Invoice): Invoice {
  return {
    ...invoice,
    employerEmail: (invoice.employerEmail || '').trim().toLowerCase(),
    freelancerName: (invoice.freelancerName || '').trim(),
    freelancerEmail: (invoice.freelancerEmail || '').trim().toLowerCase(),
    walletAddress: (invoice.walletAddress || '').trim().toLowerCase(),
    network: (invoice.network || '').trim().toLowerCase(),
    token: (invoice.token || '').trim().toUpperCase(),
    role: (invoice.role || '').trim(),
    description: (invoice.description || '').trim(),
  };
}
