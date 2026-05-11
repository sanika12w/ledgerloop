# DEVLOG.md

## Day 1 — 2026-05-06

**Hours worked:** 4

**What I did:**
Started setting up the project using Next.js, TypeScript, and Tailwind. Spent most of the time deciding how the audit flow should work and what information users should enter. Built the initial homepage hero section and basic layout structure.

**What I learned:**
Got more comfortable using the App Router structure in Next.js and organizing components/types properly from the beginning instead of dumping everything into one file.

**Blockers / what I'm stuck on:**
Was confused initially about how to structure the tool + pricing data because different AI products have very different plans.

**Plan for tomorrow:**
Build the actual audit form and dynamic tool selection UI.


## Day 2 — 2026-05-07

**Hours worked:** 6

**What I did:**
Built the main audit form with dynamic rows for tools, pricing plans, seats, and monthly spend. Added add/remove tool functionality and connected all inputs using React state. Also added localStorage persistence because refreshing the page kept wiping entered data.

**What I learned:**
Learned how tricky updating nested state can get when arrays of objects are involved. Had to be careful not to mutate the original state accidentally.

**Blockers / what I'm stuck on:**
Spent a lot more time debugging form updates than expected. Some dropdown values were not updating correctly when switching tools.

**Plan for tomorrow:**
Start working on the recommendation engine and results section.


## Day 3 — 2026-05-08

**Hours worked:** 5

**What I did:**
Implemented the recommendation logic that calculates possible savings opportunities. Added rules for downgrade suggestions and overlapping AI tools. Built the results panel to show estimated monthly savings and recommendations clearly.

**What I learned:**
Realized separating logic from UI early makes things way easier later when debugging or changing features.

**Blockers / what I'm stuck on:**
The savings totals were sometimes inconsistent because I forgot to handle undefined values properly in one reducer.

**Plan for tomorrow:**
Integrate AI summaries and start saving reports to the database.


## Day 4 — 2026-05-09

**Hours worked:** 7

**What I did:**
Integrated the OpenAI summary API so audits also include a readable AI-generated explanation. Connected Supabase and started storing generated audits in the database. Also worked on generating shareable report links.

**What I learned:**
Learned how useful server-side API routes are in Next.js for hiding API keys and keeping logic centralized.

**Blockers / what I'm stuck on:**
Supabase inserts were failing at one point because the payload shape didn’t exactly match the table schema. Took a while to trace that issue.

**Plan for tomorrow:**
Finish the public audit report page and improve styling/responsiveness.


## Day 5 — 2026-05-10

**Hours worked:** 6

**What I did:**
Built the public `/audit/[id]` page that displays saved reports from Supabase. Added copy-link functionality and worked on improving the UI overall. Also added lead capture functionality with email submission and Resend integration.

**What I learned:**
Learned more about dynamic routes and metadata generation in Next.js. Also understood how useful small UX improvements like loading states and copy buttons can be.

**Blockers / what I'm stuck on:**
Kept getting a strange TypeScript warning around `setFormData` even though the project compiled successfully. VS Code error messages were honestly more confusing than helpful at times.

**Plan for tomorrow:**
Finish deployment, cleanup, documentation, and final testing.


## Day 6 — 2026-05-11

**Hours worked:** 5

**What I did:**
Finalized the project and deployed it to Vercel. Added screenshots, completed README and architecture documentation, cleaned up comments, and tested the full flow from audit generation to shareable links. Also added basic rate limiting and honeypot spam protection for the lead form.

**What I learned:**
Learned a lot about deployment flow, environment variables, and production debugging. Also realized documentation takes much longer than expected when trying to keep things clear and organized.

**Blockers / what I'm stuck on:**
Mostly minor polish issues today. The app builds successfully, but a few editor warnings still show up even though functionality works correctly.

**Plan for tomorrow:**
No major development planned immediately. If I continue the project later, I’d probably add authentication, dashboards, and better analytics for saved audits.
