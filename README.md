# Casino Demo

A full-stack React + Vite + TypeScript application demonstrating age verification via ID Verifier API. Includes a server-side proxy for secure API calls, QR code flow for mobile devices, and a blurred casino background with floating modals.

## Features

* **Age & Liveness Verification**: Checks `ageOver18` and optional `portraitLivenessPassive` liveness score.
* **QR Code Flow**: Generates a QR code on desktop for mobile verification via custom scheme (`idverifier://?id=…`).
* **Modal UI**: Floating modal over a blurred casino background on all pages.
* **Auto-Reload**: Reloads verification page after 60 seconds if no result.
* **One-Time JWT (optional)**: Proxy can issue a JWT proof token for secure sessions.
* **Express Proxy**: Server-side (`server.js`) forwards requests to APIM, protecting subscription key.

## Table of Contents

* [Demo](#demo)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)

  * [Environment Variables](#environment-variables)
  * [Installation](#installation)
  * [Development](#development)
  * [Production Build](#production-build)
* [Deployment](#deployment)

  * [Azure Static Web Apps (legacy)](#azure-static-web-apps-legacy)
  * [Azure App Service](#azure-app-service)
* [Project Structure](#project-structure)
* [Customizing](#customizing)
* [License](#license)

## Demo

<!-- ![Demo GIF](docs/demo.gif) -->

A walkthrough of the verification flow over a casino background.

## Prerequisites

* Node.js v18 or v20 LTS
* npm or yarn
* Git
* An ID Verifier APIM subscription key

## Getting Started

### Environment Variables

Create a `.env` file in the root with your settings:

```
VITE_SUBS_KEY=<your-subscription-key>
VITE_APIM_BASE=https://reactid-api-management.azure-api.net
JWT_SECRET=<optional-jwt-secret>
```

### Installation

```bash
git clone https://github.com/your-org/casino-demo.git
cd casino-demo
npm install
```

### Development

```bash
npm run dev
```

* Frontend: `http://localhost:5173`
* Dev proxy forwards `/api/*` to APIM via Vite config.

### Production Build

```bash
npm run build
```

Outputs static files to `dist/`, and server code remains at `server.js`.

## Deployment

### Azure Static Web Apps (legacy)

*If using SWA and Azure Functions proxy:*

1. Configure `api_location: api` in workflow
2. Deploy via `azure-static-web-apps-deploy` GitHub Action

### Azure App Service

1. Ensure `start` script in `package.json` is `node server.js`.
2. Add App Settings in Azure:

   * `VITE_SUBS_KEY`
   * `VITE_APIM_BASE`
   * `JWT_SECRET` (if using)
3. Deploy with \[azure/webapps-deploy\@v2] using publish profile or OIDC.

## Project Structure

```
/ ─ root
├─ api/               # (if SWA) Azure Functions proxy
├─ public/
│   └─ assets/        # bg.jpg, idverifier-logo.png
├─ src/
│   ├─ assets/
│   │   └─ idverifier-logo.png
│   ├─ hooks/
│   │   └─ useAgeVerification.ts
│   ├─ routes/
│   │   ├─ Welcome.tsx
│   │   ├─ AgeVerification.tsx
│   │   ├─ Verified.tsx
│   │   ├─ Result.tsx
│   │   └─ LivenessError.tsx
│   ├─ styles/
│   │   ├─ global.css
│   │   └─ PageWithBackground.css
│   ├─ server.js      # Express proxy
│   └─ main.tsx       # React entry
├─ .env
├─ package.json
├─ README.md         # <-- this file
└─ vite.config.ts
```

## Customizing

* **Branding**: Swap `public/assets/bg.jpg` and logo asset.
* **Colors**: Update CSS variables in `global.css`.
* **Flow**: Adjust liveness threshold in `AgeVerification.tsx` handler.

## License

MIT © Your Name
