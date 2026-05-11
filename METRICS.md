# METRICS.md

## North Star Metric

**Qualified Audit-to-Value Conversion Rate**

This is the percentage of users who:
1. Complete an AI stack audit
2. Book a follow-up action (Credex consultation / optimization interest)
3. Demonstrate measurable cost-saving opportunity

### Why this metric
This is not a daily-use product. It is a **high-intent, low-frequency B2B diagnostic tool**.

The real value is not usage — it is **decision impact**:
- Did the audit surface meaningful savings?
- Did it trigger a business conversation?
- Did it lead to monetization (Credex or internal budget action)?

So success is measured in **conversion from insight → action**, not engagement.

---

## 3 Input Metrics Driving the North Star

### 1. Audit Completion Rate
% of users who finish entering full AI stack data

- Indicates friction in onboarding
- Low rate = form too complex or unclear value

---

### 2. Share Rate of Audit Link
% of users who copy/share audit results

- Strong proxy for internal team relevance
- Indicates perceived value beyond individual user

---

### 3. High-Savings Detection Rate
% of audits showing >$200/month potential savings

- Measures product-market fit signal strength
- If low, pricing model or detection logic is weak

---

## What I Would Instrument First

1. Funnel tracking:
   - Page visit → form start → form completion → audit generation

2. Share event tracking:
   - Copy link clicks
   - Audit page re-visits from shared links

3. Savings distribution:
   - Histogram of calculated savings per audit

4. Credex conversion tracking:
   - Audit → consultation click → signup event

---

## Pivot Trigger Threshold

I would consider a pivot if, after ~200–300 audits:

- <20% audit completion rate (too much friction)
- <5% share rate (low perceived value)
- <2% conversion to any downstream action
- Median savings detected < $50/month (weak value signal)

---

## Interpretation Rule

This product succeeds only if:
> “Users feel surprised enough by savings to show it to someone else.”

If audits are not socially shareable inside companies, the product is not working — regardless of traffic.