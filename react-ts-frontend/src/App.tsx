import { BrowserRouter, Route } from "react-router-dom";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Streaming from "@/pages/Streaming";

import { datadogRum } from "@datadog/browser-rum";
import { ErrorBoundary, reactPlugin } from "@datadog/browser-rum-react";
import { Routes } from "@datadog/browser-rum-react/react-router-v7";

import type { Fallback } from "@datadog/browser-rum-react/cjs/domain/error/errorBoundary";

if (import.meta.env.VITE_APP_ENV === "prod") {
  const applicationId: string = import.meta.env.VITE_APP_DD_APP_ID;
  const clientToken: string = import.meta.env.VITE_APP_DD_CLIENT_TOKEN;

  datadogRum.init({
    applicationId: applicationId,
    clientToken: clientToken,
    site: "datadoghq.com",
    service: "rum-video-streaming-frontend",
    env: "prod",
    version: "1.0.0",
    defaultPrivacyLevel: "mask-user-input",
    allowedTracingUrls: [
      (url) => url.startsWith("http://localhost:3000"),
      (url) => url.startsWith("http://rum-video-streaming-backend:3000"),
    ],
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackResources: true,
    trackViewsManually: false,
    trackLongTasks: true,
    trackUserInteractions: true,
    enablePrivacyForActionName: true,
    plugins: [reactPlugin({ router: true })],
  });
}

function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route
              path="streaming/:id/:playbackId/:title/:viewerUserId"
              element={<Streaming />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

const ErrorFallback: Fallback = ({ resetError, error }) => {
  return (
    <p>
      Oops, something went wrong! <strong>{String(error)}</strong>{" "}
      <button onClick={resetError}>Retry</button>
    </p>
  );
};

export default App;
