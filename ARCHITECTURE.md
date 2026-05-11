# ARCHITECTURE.md

# LedgerLoop Architecture

LedgerLoop is a full-stack AI spend optimization platform built using Next.js, Supabase, OpenAI, and Vercel. The application allows users to audit their AI tool usage, generate savings recommendations, store reports, and share audit links publicly.


# System Architecture

```mermaid
flowchart TD

A[User Browser] --> B[Next.js Frontend]

B --> C[Audit Engine]
B --> D[/api/summary]
B --> E[/api/lead]
B --> F[/api/audit]

D --> G[OpenAI API]
E --> H[Supabase]
E --> I[Resend Email API]

F --> H

B --> H

H --> J[(PostgreSQL Database)]

B --> K[/audit/id]

K --> H
```


# Data Flow

## 1. User Inputs Audit Data

The user enters:

* AI tools
* pricing plans
* monthly spend
* number of seats
* primary use case

inside the audit form.


## 2. Frontend Generates Recommendations

The frontend calls the deterministic audit engine:

```text
generateAudit(formData)
```

This calculates:

* duplicate tool overlap
* downgrade opportunities
* possible monthly savings


## 3. AI Summary Generation

The frontend sends the audit data to:

```text
/api/summary
```

The API route calls the OpenAI API to generate:

* optimization insights
* summarized recommendations
* human-readable audit analysis


## 4. Audit Saved to Supabase

The generated audit result is stored in the Supabase `audits` table.

Stored fields include:

* tools
* recommendations
* total savings

A unique public audit ID is returned.


## 5. Public Share Link Generated

The application generates:

```text
/audit/[id]
```

Anyone with this link can view the audit report.


## 6. Lead Capture Flow

If the user submits their email:

* data is stored in Supabase `leads` table
* confirmation email is sent using Resend
* honeypot spam protection + rate limiting are applied


# Why I Chose This Stack

## Next.js

* Unified frontend + backend
* API routes built-in
* Easy deployment on Vercel
* App Router simplifies server rendering and metadata

## TypeScript

* Better type safety
* Easier debugging
* More maintainable codebase

## Supabase

* Fast backend setup
* PostgreSQL support
* Easy REST-style integration
* Good fit for MVP architecture

## Tailwind CSS

* Rapid UI development
* Responsive design support
* Cleaner component styling workflow

## OpenAI API

* Generates dynamic AI-powered summaries
* Makes audit results more personalized

## Vercel

* Seamless deployment for Next.js
* Automatic CI/CD from GitHub
* Simple environment variable management


# Scalability Improvements for 10k Audits/Day

If LedgerLoop needed to handle large-scale production traffic, I would improve several areas.

## 1. Move Rate Limiting to Redis

Current implementation uses in-memory rate limiting.

At scale:

* use Redis
* support distributed servers
* prevent memory reset issues


## 2. Queue AI Requests

OpenAI requests would become expensive and slow at scale.

I would:

* add a background queue
* process summaries asynchronously
* use workers for AI tasks

Tools:

* BullMQ
* Upstash Redis
* RabbitMQ


## 3. Cache Frequent Recommendations

Many audits may produce similar outputs.

I would:

* cache repeated audit patterns
* reduce OpenAI usage
* improve response speed


## 4. Improve Database Indexing

Add indexes on:

* audit IDs
* timestamps
* email fields

This improves lookup speed for public reports and analytics.


## 5. Add Authentication + Multi-Tenant Accounts

For production SaaS usage:

* user authentication
* organizations/workspaces
* dashboard history
* saved audits
* billing system

would be added.


# Current Deployment Architecture

* Frontend: Vercel
* Backend APIs: Next.js API Routes
* Database: Supabase PostgreSQL
* Email Service: Resend
* AI Provider: OpenAI
