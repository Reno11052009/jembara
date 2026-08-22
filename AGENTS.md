<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Jembara Product and Development Context

## Project identity

- Name: **Jembara**
- Tagline: **Jembatani Keterampilan, Wujudkan Peluang**
- Competition: **ITECHNO CUP 2026 — Web Development**
- Repository: `https://github.com/Reno11052009/jembara`
- Live site: `https://jembara.web.id`

Do not rename the project, change its main purpose, or replace its core concept unless the user explicitly requests it.

## Core concept and goals

Jembara connects students who have practical skills with UMKM businesses that need help completing digital projects. Typical student skills include web development, UI/UX design, graphic design, video editing, photography, digital marketing, and social media management. Typical UMKM projects include websites, product catalogs, logos, promotional content, videos, product photography, and social media management.

The product must:

- Give students real project experience.
- Help students build portfolios and professional reputations.
- Help UMKM find suitable talent.
- Support UMKM digitalization.
- Demonstrate a strong connection to SDG 8: Decent Work and Economic Growth.

Optimize for a convincing competition demo, a clear user journey, working features, explainable Smart Matching, and implementation quality rather than feature count.

## Primary actors

### Student

- Register, log in, and maintain a student profile.
- Add skills and skill levels, portfolios, location, and availability.
- Browse and receive recommended projects.
- Submit proposals and manage active projects.
- Submit work, complete projects, receive reviews, and build a Skill Passport.

### UMKM

- Register, log in, and maintain a business profile.
- Create projects with required skills, budget, deadline, and work location/mode.
- Review ranked candidates and student portfolios.
- Accept or reject proposals and select a candidate.
- Monitor collaboration, review submitted work, and provide ratings and reviews.

### Admin

- Oversee users and projects.
- Moderate content and reports.
- Manage skill verification when that workflow is implemented.
- Keep the MVP admin surface minimal unless a richer admin flow is explicitly requested.

## Canonical business flow

1. UMKM creates and publishes a project with skill requirements, budget, and deadline.
2. The project becomes `OPEN` and accepts proposals.
3. Smart Matching ranks suitable students and recommends the project to suitable students.
4. Students submit proposals.
5. UMKM reviews candidates and proposals during `PROPOSAL` selection.
6. UMKM selects one candidate and collaboration starts at `IN_PROGRESS`.
7. The student submits the result and the project moves to `REVIEW`.
8. UMKM approves the result or requests revisions.
9. The project becomes `COMPLETED` after approval.
10. UMKM provides a rating and review.
11. The completed project, rating, review, and portfolio evidence update the student's reputation and Skill Passport.

Supported project statuses are:

- `OPEN`
- `PROPOSAL`
- `IN_PROGRESS`
- `REVIEW`
- `COMPLETED`
- `CANCELLED`

Treat status changes as an enforced state machine. Do not allow arbitrary transitions or client-controlled ownership changes.

## Smart Matching

Smart Matching is the primary differentiator and is required for the MVP. It must consider more than exact skill matches.

Initial factors and weights:

- Skills: 40%
- Portfolio: 20%
- Rating: 15%
- Budget: 10%
- Availability: 10%
- Location: 5%

Normalize every factor to a comparable scale before applying the weights. Matching should be deterministic and explainable for the competition demo. Show both the total score, such as `92% Match`, and concise reasons such as matched required skills or availability.

When implementing matching:

- Distinguish required skills from optional skills.
- Do not let strong secondary factors hide a failure to meet mandatory skills.
- Avoid treating students without ratings as automatically poor candidates; use an explicit neutral/cold-start rule.
- Relate portfolios to skills or categories before scoring portfolio relevance.
- Define remote, hybrid, and onsite behavior before applying the location score.
- Ensure budget scoring uses an explicit source, such as the submitted proposal amount or a defined student expectation.
- Store or otherwise reproduce the score inputs used for important ranking decisions so demo results remain explainable.

## MVP requirements

Prioritize one complete, demonstrable end-to-end flow. The MVP consists of:

1. Authentication, role selection, authorization, and protected routes.
2. Student and UMKM profiles.
3. Student skills, skill levels, portfolio, and availability.
4. UMKM project creation and management.
5. Project skill requirements, budget, deadline, and location/work mode.
6. Project marketplace with basic search and filters.
7. Smart Matching v1, project recommendations, and candidate ranking.
8. Proposal submission, acceptance, rejection, and candidate selection.
9. Active-project lifecycle and result submission through completion.
10. Ratings and reviews after completion.
11. A basic Skill Passport derived from real profile and project data.
12. In-app notifications for important events.
13. Role-appropriate dashboards backed by real data.
14. Minimal admin oversight if required by the demo.

## Advanced features

Do not prioritize these until the complete MVP flow works:

- Adaptive or machine-learning matching.
- Formal skill tests and advanced verification.
- Realtime chat, video calls, or rich collaboration tools.
- Milestones, file versioning, or multi-stage approvals.
- Payments, escrow, withdrawals, or financial settlement.
- Email and push notifications.
- Dispute resolution and advanced review moderation.
- Certificates and advanced public Skill Passports.
- Advanced analytics and audit tooling.

Do not add features merely to make the feature list longer. An advanced feature must directly support the competition story or remove a real MVP blocker.

## Feature dependencies and implementation priority

Use this dependency order:

`Auth and roles → Profiles and skill taxonomy → Project creation → Matching and marketplace → Proposals and candidate selection → Collaboration and status flow → Completion and reviews → Reputation and Skill Passport`

Notifications and dashboards consume events/data from the core flow and should be integrated after the relevant core operations work. Admin moderation depends on stable user, project, and review models.

Default implementation priority:

1. Authentication, roles, and access control.
2. Profiles and master skill data.
3. Project creation and lifecycle rules.
4. Smart Matching v1 and score explanations.
5. Marketplace and recommendations.
6. Proposals and candidate selection.
7. Active collaboration, result submission, and review.
8. Ratings, reputation, and Skill Passport.
9. Notifications and real dashboards.
10. Minimal administration.
11. End-to-end tests, demo data, failure states, and presentation polish.
12. Optional advanced features.

## Business rules that require explicit decisions

Do not silently invent high-impact rules when work touches one of these unresolved areas. Inspect existing code and ask the user if the task cannot be completed safely without choosing:

- The exact definition and allowed transition for every project status.
- Whether a project can select more than one student.
- When `OPEN` changes to `PROPOSAL` and when further proposals close.
- Fixed budget versus budget range and how proposal negotiation works.
- Revision limits, deadlines, late work, inactivity, and cancellation effects.
- Who may mark work as submitted, approved, completed, or cancelled.
- Whether ratings are one-way or mutual and how reviews are moderated.
- Skill-level scale and evidence requirements.
- Who verifies a skill and what `verified` guarantees.
- Exact normalization and cold-start rules for every matching factor.
- How portfolio relevance is categorized and scored.
- Remote, hybrid, onsite, and location-distance rules.
- Minimum collaboration tools required for the MVP.
- Minimum admin capabilities required for the competition demo.

## Technical direction

- Frontend: Next.js 16 App Router, React, TypeScript, Tailwind CSS v4, Lucide React, React Icons, and Lenis.
- Backend: Next.js Server Actions on Node.js.
- Database: PostgreSQL hosted on Supabase.
- ORM: Prisma ORM v7.
- Authentication target: use one identity authority. The current repository uses custom JWT sessions with `jose`; do not combine custom JWT and Supabase Auth in the same user flow without an explicit migration design.
- Deployment: Vercel.
- Testing: Vitest, plus focused integration or end-to-end coverage for the competition-critical flow.

Follow server/client boundaries carefully. Keep authorization and ownership checks on the server, validate all Server Action inputs, and derive matching/reputation values from trusted database data.

## Current repository baseline

Verify this baseline before relying on it because it will evolve:

- Next.js 16 App Router, Prisma 7, PostgreSQL/Supabase pooler, and custom JWT sessions are configured.
- Authentication, role selection, profiles, and notifications have database-backed implementation.
- The schema already includes users, students, UMKM, projects, proposals, skills, portfolios, reviews, and notifications.
- Much of the dashboard, marketplace, proposals, messages, earnings, active projects, and portfolio UI currently uses mock data.
- The schema still needs full support for skill levels, `CANCELLED`, collaboration/deliverables, status history, and all matching inputs before the complete product flow is real.

When implementing future requests, preserve the established architecture where practical, replace mock data incrementally with real data, and keep every change consistent with the Jembara concept and MVP priorities above.
