# Admin Panel App

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h2>Admin Panel Screenshots</h2>
        <p>
          This link opens a public album with screenshots of the admin panel so you can quickly review the interface and overall flow.
        </p>
        <p>
          <a href="https://admin.nzhussup.com/public/albums/f5c727a5-32d3-4587-aa9b-2fa23bd3a44f"><strong>Open the public screenshot album</strong></a>
        </p>
        <p>
          Want to see how it is implemented? Browse the screenshots first, then use this README to understand the project structure, runtime setup, and local development commands.
        </p>
      </td>
    </tr>
  </table>
</div>

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
