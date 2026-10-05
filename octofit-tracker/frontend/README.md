# OctoFit Tracker presentation tier

The React 19 and Vite frontend uses React Router for navigation and reads tracker data from the Express API on port `8000`.

## Configure the API URL

In GitHub Codespaces, define the Vite environment variable `VITE_CODESPACE_NAME` with the value of the Codespace name. For local development, add it to `octofit-tracker/frontend/.env.local`:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The frontend builds its API URL as `https://<VITE_CODESPACE_NAME>-8000.app.github.dev`. Vite reads this value when it starts, so restart the development server after changing `.env.local`. Do not commit `.env.local`.

When `VITE_CODESPACE_NAME` is unset or empty, the frontend safely uses `http://localhost:8000`.

## Run the frontend

Start the API and frontend in separate terminals:

```bash
npm run dev --prefix octofit-tracker/backend
npm run dev --prefix octofit-tracker/frontend
```

The frontend provides Activities, Leaderboard, Teams, Users, and Workouts pages. Collection pages accept both plain array responses and paginated responses containing `results`, `items`, `records`, or `data`.
