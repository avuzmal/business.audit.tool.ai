# Phase 4: The Antigravity Flywheel & Anti-Spam Architecture

## PART A: The Analytics & Conversion Stack
- **PostHog**: Install on the Next.js app to track form step drop-off rates.
- **Resend / Postmark**: Ensure the n8n Gmail node uses a custom domain with DKIM/SPF/DMARC configured to prevent emails from landing in spam.
- **Calendly "Show" Rate Tracking**: Pass `businessName` and `email` back to n8n when a meeting is completed, updating Google Sheets status from "Booked" to "Shown".

## PART B: The "Audit-to-Build" Automated Onboarding
Instantly generate a scoped contract and invoice based on the Opportunity they agreed to buy.
- **Trigger**: Click a button in Slack/Airtable to "Generate Proposal".
- **Code Node**: Pulls lead data from Google Sheets.
- **PandaDoc API**: Creates the PDF proposal referencing "Opportunity #1" and ROI.
- **Stripe API**: Generates a payment link for the 50% deposit.
- **Gmail Node**: Sends the proposal and deposit link to the client.

## PART C: The Organic Content Flywheel (SEO & Social)
Turn generated audits into public content.
1. **Case Study Opt-In**: Add a checkbox to Step 3 of the form: *"Privacy first... would you be open to us sharing an anonymized version of your audit as a case study? [ ] Yes"*
2. **Antigravity Content Engine Agent**: Triggers when a lead is "Converted".
   - Generates a LinkedIn Text Post (Hook, Body with ROI, CTA).
   - Generates a Twitter/X Thread (5 tweets breaking down the n8n logic).

## PART D: Productized Service Packaging
Standardize pricing to match the audit output:
- **Tier 1 ($1,500)**: The Quick Win. Implement Opportunity #1 only. 1-week delivery.
- **Tier 2 ($3,500)**: The Core System. Implement Opportunities #1 & #2.
- **Tier 3 ($6,500+)**: Full Autopilot. All 3 Opportunities + Custom Dashboard + Support.

## PART E: System Maintenance & Anti-Spam
Protect the n8n webhook and Claude API credits from bots.
- **Frontend Protection (Next.js)**: 
  - Integrate Cloudflare Turnstile on the final Submit button.
  - Add a Honeypot hidden input field (`<input type="text" name="website" style="display:none" />`).
- **Backend Protection (n8n)**:
  - Add an **IF Node**: If the `website` field is NOT empty -> Stop Workflow.
  - Add a **Rate Limit Node**: Max 5 requests per minute per IP address.

## The Final Architecture
1. Traffic hits the Next.js site.
2. Frontend captures data securely (Turnstile + Honeypot) and sends to n8n.
3. n8n runs the 3-Agent Claude pipeline, generates a premium PDF, and emails it.
4. Antigravity MCP Agent reads Google Sheet, drafts a personalized follow-up in Gmail.
5. You review the draft, tweak, and send. Lead books a call.
6. On the call, you close them into a Tier 2 package.
7. Slack button triggers n8n to generate PandaDoc proposal and Stripe link. Client pays.
8. Antigravity Content Agent automatically writes a LinkedIn case study based on anonymized data.
9. Case study drives more traffic. The flywheel spins faster.
