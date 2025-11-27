# Backend deployment notes

This Spring Boot backend requires the following environment variables set in your hosting environment (e.g., Render):

- `SPRING_DATASOURCE_URL` — PostgreSQL URL in the form `postgresql://host:port/database`
- `SPRING_DATASOURCE_USERNAME` — DB username
- `SPRING_DATASOURCE_PASSWORD` — DB password
- `jwt.secret` — JWT signing secret
- `FRONTEND_URL` — (optional) The deployed frontend origin e.g. `https://syntaxtype-frontend.onrender.com`. Use this value to configure allowed CORS origins.

The backend reads `FRONTEND_URL` to allow CORS requests from your frontend domain. Set it in Render or your host's env vars. You can also set multiple origins separated by commas.

Example on Render:
1. In your backend service settings, add an environment variable named `FRONTEND_URL` with the value `https://syntaxtype-frontend.onrender.com`.
2. Deploy the service.

If you're using the Render Web service or Dockerfile, ensure the `PORT` env var is used and the start command passes `--server.port=$PORT` (the Dockerfile uses this by default).
