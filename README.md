# My Embedded Mendix Demo

Self-contained vanilla JavaScript host app for loading the Mendix embedded runtime.

## Live Demo

- GitHub Pages: https://thiloboehm.github.io/my-embedded-mendix-demo/

## Runtime

- Mendix runtime: `https://tb100100.mendixcloud.com/`
- Embedded bundle: `https://tb100100.mendixcloud.com/dist/embedded-index.js`
- Host app: `http://localhost:3000`

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deployment

This project deploys automatically to GitHub Pages on every push to the `main` branch via GitHub Actions.

## CORS Configuration (Mendix Runtime)

For cross-origin embedding from GitHub Pages to work, configure CORS headers on the Mendix runtime endpoints (`/dist/embedded-index.js` and `/xas/`).

Required headers:

- `Access-Control-Allow-Origin: https://thiloboehm.github.io`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token, X-Requested-With`
- `Vary: Origin`

Important:

- Return each CORS header exactly once (duplicate `Access-Control-Allow-Origin` caused browser CORS failures).
- Do not use `*` for `Access-Control-Allow-Origin` when credentials are enabled.

## Embedding logic

The host:

1. renders the page with plain DOM APIs
2. dynamically imports `embedded-index.js`
3. passes a DOM node to Mendix
4. calls `render(container, { remoteUrl, minHeight })`
5. stores the returned unmount function for cleanup

The host page owns the surrounding page. Mendix owns the embedded application.

## Override

You can override the runtime URL before startup with:

```js
window.__MENDIX_REMOTE_URL__ = "https://tb100100.mendixcloud.com/";
```

