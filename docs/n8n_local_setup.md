# Running n8n Webhook Locally

This guide explains how to set up and run the n8n webhook locally for testing the Business Audit Tool.

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Docker & Docker Compose (optional, but recommended for full stack local execution)

## Setup n8n

You can run n8n locally using Docker or via npx.

### Using Docker

1. Create a `docker-compose.yml` for n8n:
```yaml
version: '3.8'
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```
2. Start the service: `docker compose up -d`
3. Access n8n at `http://localhost:5678`

### Using npx

If you prefer to run it directly:
```bash
npx n8n
```

## Configuring the Webhook

1. Open n8n in your browser.
2. Create a new workflow.
3. Add a **Webhook** node.
4. Configure the Webhook node:
   - **Method**: POST
   - **Path**: `audit-trigger` (or your desired path)
   - **Respond**: Immediately
5. Copy the **Test URL** or **Production URL**.
6. Set the `WEBHOOK_URL` environment variable in your `.env.local` to this URL.

## Testing

Trigger the workflow by running your local Business Audit Tool, which will send a POST request to your n8n instance. You can observe the incoming data in the n8n UI under "Executions".
