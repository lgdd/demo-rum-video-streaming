# Demo RUM Video Streaming

This repository contains a demo environment to explore Datadog's Real User Monitoring (RUM) with logs and traces correlation.

## Application Stack

- Frontend using React with TypeScript
- Backend using Go with [Fiber](https://gofiber.io/)
- Streaming service using [Mux](https://www.mux.com/)

## Requirements

Environment variables:
- `DD_API_KEY`
- `DD_SITE`
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`
- `VITE_APP_DD_APP_ID`
- `VITE_APP_DD_CLIENT_TOKEN`

`VITE_APP_*` variables are expected in a `.env.production` for the build. See [`.env.example`](react-ts-frontend/.env.example).

`VITE_APP_DD_APP_ID` is the `applicationId` for Datadog RUM.
`VITE_APP_DD_CLIENT_TOKEN` is the `clientToken` for Datadog RUM.

Both information comes from the [setup](https://docs.datadoghq.com/real_user_monitoring/browser/setup/client/?tab=rum).

## Usage

Once the environment variables are setup, run a `docker compose build`.
If the build goes fine, you can run `docker compose up -d` and go to http://localhost:8000.

### /login

You will find a fake login page where you can use any username. It will generate a user ID by doing a sum of the ASCII code decimals of each character in the username and adding the length of the username (e.g. `lgd = 108 + 103 + 100 + 3 = 314`). The user ID is then used for telemetry data sent to Datadog.

### /home

Once you're identified, you will be redirected to the `/home` page that will call the backend on `/videos` to finally call Mux APIs to fetch the list of assets uploaded to the platform.

### /streaming

When you click on the title of one of the videos, you will be redirected to the `/streaming` page which contains URL parameters used in the `<MuxPlayer />` React component from Mux. See [Advanced usage of Mux Player
](https://www.mux.com/docs/guides/player-advanced-usage) for how to leverage custom events, and see [Mux Player API Reference](https://www.mux.com/docs/guides/player-api-reference/html#events) for the full list of events available.