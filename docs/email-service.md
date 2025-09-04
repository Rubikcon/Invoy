# Resend Email Service Implementation

## Overview
This document explains how the Resend email service was integrated into the Invoy platform for sending professional, reliable emails.

## Files Structure
- `src/services/resendService.ts` - Core implementation of the Resend service
- `src/services/emailService.ts` - High-level email service that uses Resend
- `supabase/functions/send-invoice-email/index.ts` - Serverless function for invoice emails
- `supabase/functions/send-status-email/index.ts` - Serverless function for status update emails

## Features
- Professional HTML email templates
- Development mode with mock sending
- Fallback to `mailto:` links if API service fails
- Error handling and reporting
- Email templates for:
  - Invoice notifications
  - Status update notifications

## Configuration
The email service is now configured with the following API key:
- `RESEND_API_KEY`: `re_ZZ7MiDeK_NpskHF388TiKZTgQum99zc1x` (defined in .env file)
- `NODE_ENV`: Set to `production` for real email sending, or `development` for more verbose logging

## Development
In development mode, the service:
- Logs email details with full content
- Still sends real emails using the configured Resend API key
- Provides `mailto:` links as fallback in case of API failures

## Production
In production mode (`NODE_ENV === 'production'`), the service:
- Sends real emails via Resend API
- Includes tracking tags for analytics
- Uses HTML templates for professional appearance
- Falls back to `mailto:` links only if API fails

## Error Handling
- API errors are caught and logged
- Multiple fallbacks exist (Resend → mailto → copy content)
- Rate limiting is implemented to prevent abuse

## Future Enhancements
- Add more email templates for different notification types
- Implement email open/click tracking
- Add email scheduling capabilities
- Implement multi-language support

## Notes
- The Resend API key should be kept secret and only stored in secure environment variables
- Never commit the actual API key to version control
- Test email delivery to ensure SPF and DKIM are configured correctly
