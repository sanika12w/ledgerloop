# REFLECTION.md

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug I faced was with the shareable audit report route (`/audit/[id]`). The feature worked inconsistently during development. Sometimes the report loaded correctly, but other times it showed “Not Found” or failed completely after deployment testing.

At first, I thought the problem was with Supabase inserts, so I added console logs to check whether audit IDs were actually being returned after saving reports. The database calls were working correctly, which ruled that out. Then I started debugging the Next.js App Router setup and checked whether the dynamic route was receiving the correct ID.

After testing different possibilities, I realized the issue was caused by how route params were being handled in the server component setup along with some deployment environment variable mistakes. I fixed it by restructuring the route logic, validating audit IDs before generating share links, and improving the error handling for missing records.

This bug took the most time because it involved frontend routing, backend fetching, and deployment behavior together. It taught me how important systematic debugging is instead of randomly changing code.

---

## 2. A decision you reversed mid-week, and what made you reverse it

Initially, I planned to keep the project very lightweight and only generate audit recommendations directly on the frontend. My first idea was to avoid adding persistence or backend-heavy features to save time.

Mid-week, I changed that decision and added Supabase storage along with shareable audit report links. I realized the project felt incomplete without a way to save or revisit generated audits. Once I added persistence, the app started feeling more like a real SaaS product instead of just a frontend demo.

Although it added more complexity, it made the project much stronger overall and gave me real full-stack experience.

---

## 3. What you would build in week 2 if you had it

If I had another week, I would focus on improving the analytics and personalization side of the product. Right now, the audit engine gives deterministic recommendations, but I would like to make the suggestions smarter and more contextual.

I would also add visual dashboards with charts for monthly savings trends, tool comparisons, and yearly projections. Another improvement would be authentication so users can manage multiple audits from one account.

On the UX side, I would improve responsiveness further and add export options like PDF reports and email delivery.

---

## 4. How you used AI tools

I used ChatGPT mainly for debugging help, Tailwind styling improvements, and understanding Next.js App Router patterns. It helped speed up development and gave alternative approaches when I was stuck.

However, I didn’t fully trust AI-generated code. I tested everything manually because some suggestions used outdated patterns or didn’t fit my project structure. For example, a fix for a React state + localStorage issue looked correct but still caused errors, so I had to debug it myself.

Overall, AI was useful as a support tool, but I still had to understand and validate everything.

---

## 5. Self-rating

- **Discipline — 8/10**  
  I stayed consistent and kept making progress even during long debugging sessions.

- **Code Quality — 7/10**  
  Code is clean and modular, but still has room for better typing and structure improvements.

- **Design Sense — 8/10**  
  Focused on modern UI, spacing, and responsiveness instead of only functionality.

- **Problem Solving — 8/10**  
  Improved debugging approach, especially with full-stack issues involving routing and database.

- **Entrepreneurial Thinking — 7/10**  
  Added persistence, shareable links, and lead capture to make it feel like a real product.