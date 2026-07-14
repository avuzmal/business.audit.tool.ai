# Calendly Integration for n8n

To accurately track when a lead converts from "New" or "Drafted" to a booked call, you should integrate Calendly back into your CRM (Google Sheets).

## The Workflow Setup

1. **Trigger Node**: Add a `Calendly Trigger` node in n8n.
   - **Event**: `Invitee Created`
   - **Authentication**: Connect your Calendly account via Personal Access Token.

2. **Google Sheets Node (Lookup)**:
   - **Operation**: `Read` -> `Get Many`
   - **Resource**: Find the row where the `Email` column matches `{{ $json.payload.email }}` from the Calendly trigger.

3. **Google Sheets Node (Update)**:
   - **Operation**: `Update`
   - **Resource**: Update the matched row.
   - **Action**: Change the `Status` column from "New" or "Drafted" to **"Call Booked"**.

4. **Slack Node (Optional but recommended)**:
   - **Action**: Send a message to your `#wins` channel.
   - **Text**: `🔥 Call Booked! {{ $json.payload.email }} just booked a discovery call from the Audit flow!`

This simple loop ensures your SDR Agent (Antigravity) stops sending nurture emails (Touch 2 & 3) once the prospect has booked a call!
