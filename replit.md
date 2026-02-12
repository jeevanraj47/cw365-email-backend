# replit.md

## Overview

This is a simple Node.js email-sending microservice. It exposes a REST API endpoint that accepts email content (subject, text, HTML body) and sends it to a preconfigured recipient using Gmail's SMTP service via Nodemailer. The server is built with Express and is designed to be consumed by a frontend or other service that needs to trigger email delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend

- **Framework:** Express 5.x — a minimal Node.js web framework handling HTTP routing and middleware.
- **Entry point:** `index.js` — contains all server logic in a single file. There is no multi-file architecture, routing layer, or controller separation at this time.
- **CORS:** Enabled globally via the `cors` middleware, allowing any origin to call the API. This is suitable for development or when the service is consumed by a separate frontend.
- **Environment variables:** Managed via `dotenv`. The following variables are required:
  - `EMAIL_USER` — Gmail address used to send emails
  - `EMAIL_PASS` — Gmail app password (not the regular account password; requires Gmail App Passwords to be set up)
  - `RECEIVER_EMAIL` — The fixed recipient email address
  - `PORT` — (optional) Server port, defaults to 5000

### API Endpoints

| Method | Path           | Description                                      |
|--------|----------------|--------------------------------------------------|
| GET    | `/`            | Health check — returns a simple status message   |
| POST   | `/send-email`  | Sends an email. Accepts JSON body with `subject`, `text`, and `html` fields. All fields are optional with fallback defaults. |

### Design Decisions

- **Single recipient pattern:** The recipient is configured server-side via environment variable rather than accepted from the client. This prevents abuse (open relay) and is appropriate for contact-form-style use cases.
- **Gmail SMTP via Nodemailer:** Chosen for simplicity. Gmail's SMTP is free and easy to set up with app passwords. The tradeoff is Gmail rate limits (around 500 emails/day for regular accounts) and the requirement for app-specific passwords. For production at scale, a dedicated email service (SendGrid, Mailgun, AWS SES) would be more appropriate.
- **No database:** This is a stateless service — it processes requests and sends emails without persisting any data.
- **No authentication on the API:** The `/send-email` endpoint is unprotected. If exposed publicly, it should be secured with API keys, rate limiting, or other access controls.

### Running the Application

Start the server with:
```bash
node index.js
```
The server listens on `0.0.0.0` at the configured port (default 5000).

## External Dependencies

### NPM Packages

| Package       | Purpose                                           |
|---------------|---------------------------------------------------|
| `express`     | Web framework for HTTP server and routing         |
| `nodemailer`  | Email sending library with SMTP support           |
| `cors`        | Middleware to enable Cross-Origin Resource Sharing |
| `dotenv`      | Loads environment variables from `.env` file      |
| `@types/node` | TypeScript type definitions for Node.js (present but not actively used — no TypeScript config exists) |

### External Services

- **Gmail SMTP** (`smtp.gmail.com`) — Used as the email transport. Requires a valid Gmail account with an app password configured. The `service: 'gmail'` shorthand in Nodemailer handles SMTP host/port configuration automatically.