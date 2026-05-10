# LedgerLoop — AI Spend Optimization Engine

LedgerLoop is a deterministic SaaS audit tool that helps teams analyze and optimize their AI tool spending. It detects inefficiencies such as over-provisioned seats, overlapping AI tools, and overpriced plans, and provides actionable cost-saving recommendations.

---

## 🚀 Features

- AI tool spend audit in under 60 seconds
- Deterministic rule-based recommendation engine (no AI hallucination)
- Detects:
  - Overpriced enterprise plans
  - Unused seats
  - Overlapping AI tools
  - High API spend inefficiencies
  - Cheaper alternative tools
- Email delivery of audit results via Resend
- Shareable audit URL with public view
- Supabase-powered storage
- Rate limiting + honeypot spam protection

---

## 🧠 How It Works

### 1. User Input
Users enter:
- AI tools used
- Plan type
- Monthly spend
- Seat count
- Team size
- Primary use case

---

### 2. Audit Engine (Deterministic Rules)

The system evaluates:

- Seat inefficiency
- Plan mismatch (small teams on enterprise tiers)
- Tool duplication (ChatGPT / Claude / Gemini overlap)
- Coding assistant redundancy
- API usage inefficiencies
- High spend enterprise negotiation potential
- Cheaper alternative AI tools

No AI models are used in the recommendation engine — all logic is deterministic.

---

### 3. Savings Calculation

Savings are:
- Capped to avoid unrealistic outputs
- Based on real-world SaaS pricing heuristics
- Prevent inflated percentage-based estimates

---

### 4. Data Storage

Audits are stored in Supabase:

- Table: `audits`
- Fields:
  - `id` (UUID)
  - `tools`
  - `recommendations`
  - `total_savings`

---

### 5. Email Delivery

Uses Resend:

- Sends audit summary email after generation
- Includes conditional insights based on savings level

---

### 6. Shareable Audit Link

Each audit generates:

## 🔐 Abuse Protection

LedgerLoop implements multiple layers of protection:

### 1. Rate Limiting
- IP-based request throttling
- Prevents spam submissions
- Returns HTTP 429 when exceeded

### 2. Honeypot Field
- Hidden input field in form
- Bots often fill it → auto-blocked

### 3. Input Validation
- Email format validation
- Spend & seat sanity checks

## 📊 Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Database)
- Resend (Email API)
- TailwindCSS (UI)


## 📁 Project Structure

/app
  /api
    /audit
    /summary
  /audit/[id]
/components
/lib
  supabaseClient.ts
  rateLimit.ts
/utils
  auditEngine.ts

  ## 🔥 Key Design Principle

No AI-generated financial reasoning is used.

All recommendations are:
- deterministic
- explainable
- rule-based

## 🚀 Future Improvements

- Pricing benchmark database per AI tool
- Recommendation scoring system
- Confidence % per suggestion
- PDF export of audit reports
- Team analytics dashboard

## Author

Built as a deterministic AI spend optimization system for SaaS teams.