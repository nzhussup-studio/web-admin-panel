# Admin Panel App

This directory contains the React/Vite application for the admin UI.

## Runtime Variables

The build uses these Vite variables:

- `VITE_API_BASE`
- `VITE_KEYCLOAK_URL`
- `VITE_KEYCLOAK_REALM`
- `VITE_KEYCLOAK_CLIENT_ID`

Example local values:

```bash
VITE_API_BASE=http://localhost:8082
VITE_KEYCLOAK_URL=http://localhost:8081
VITE_KEYCLOAK_REALM=backend-auth-dev
VITE_KEYCLOAK_CLIENT_ID=frontend-admin-auth-client
```

## Commands

```bash
npm ci
npm run dev
npm test
npm run typecheck
npm run build
```

## Notes

- Authentication is handled entirely through Keycloak redirects.
- The internal `/users` page was removed; the dashboard links to the Keycloak admin users section instead.
- API access tokens are sourced from Keycloak and sent to the backend as bearer tokens.
