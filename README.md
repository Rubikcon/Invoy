# 🚀 Invoy — Web3 Invoicing Made Simple

**Invoy** is a decentralized invoicing tool that allows freelancers and remote workers to create, share, and manage crypto invoices securely. Employers can review and approve invoices via email, ensuring wallet and network alignment before sending crypto payments — all powered by blockchain.

---

## 📌 Overview

In Web3 freelance transactions, payment details are often shared informally, resulting in:

- ❌ Wrong wallet or chain selection  
- ❌ Lack of formal invoicing process  
- ❌ No traceability or audit trail  
- ❌ Delayed or missed payments  

**Invoy** solves these issues by enabling freelancers to send verified, chain-aware crypto invoices that employers can securely approve and pay — with complete transparency.

---

## 👥 Target Users

- **Freelancers / Remote Employees** who get paid in cryptocurrency  
- **Employers / Clients** seeking a secure, verifiable way to approve and send crypto payments

---

## 🧠 Problem Statement

> There is no easy or verifiable way for freelancers to invoice clients in Web3 without the risk of wallet mismatch, lost payments, or lack of approval flows.

---

## ✅ Solution

Invoy provides a user-friendly invoicing system tailored for crypto payments. Freelancers can generate invoices with wallet and network verification. Employers receive an email to review and approve the invoice before payment. No traditional banks. No confusion.

---

## 🔑 Core Features

### 1. 🔐 Wallet Connection

- Connect Metamask or WalletConnect  
- Automatically detect wallet address and chain  
- Prompt if the selected chain doesn’t match the connected wallet  

---

### 2. 🧾 Invoice Creation Flow

Users can generate invoices by filling in:

- Full Name  
- Email Address  
- Wallet Address  
- Network Selection (with chain ID verification)  
- Role/Title  
- Description of Work Done  
- Amount to be Paid  
- Employer’s Email Address  

> 📩 Click “Send Invoice” to generate a secure, shareable link sent to the employer via email.

---

### 3. 📬 Employer Notification & Review

- Employers receive a secure invoice link via email  
- Can review full invoice details  
- Choose to:
  - ✅ Accept and proceed to payment  
  - ❌ Reject with a selected or custom reason  

---

### 4. 💸 Payment Process

- Employer pays directly to the wallet address on the verified chain  
- Optionally mark invoice as **Paid** for internal tracking  
- Invoy does **not** custody or move funds — users control payments end-to-end  

---

### 5. ✅ Verification Layer

- Verifies network-chain compatibility before sending invoices  
- Alerts users if selected network and wallet mismatch  
- Prevents expensive mistakes and builds trust

---

## ⚙️ Technical Overview

| Layer       | Tech Stack                            |
|-------------|----------------------------------------|
| Frontend    | TypeScript + Next.js                   |
| Backend     | Node.js + Supabase                     |
| Wallets     | Metamask, WalletConnect                |
| Blockchain  | EVM-compatible chains (Polygon, ETH)   |
| Emails      | Supabase Functions / Resend / SendGrid |
| Storage     | Supabase Storage for invoices          |

---

## 📊 Success Metrics

- ⏱️ % of invoices accepted and paid within 48 hours  
- ⚠️ Reduction in errors from wrong chain/wallet combinations  
- ⭐ Positive feedback and repeat usage from freelancers and employers  

---

## 🥇 Unique Selling Point (USP)

> “Never send crypto to the wrong wallet or chain again — Invoy verifies everything before you click Send.”

---

## ✨ Supporting Highlights

- ✅ Auto chain and network verification  
- 🔗 Secure, shareable invoice links  
- 💼 Employer approval before funds move  
- 🧾 Built-in invoice records for both parties  
- 📧 Email alerts to maintain trust and transparency  
- 💻 Built entirely for the decentralized Web3 ecosystem

---

