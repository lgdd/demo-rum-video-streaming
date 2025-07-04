import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { datadogRum } from "@datadog/browser-rum";
import { reactPlugin } from "@datadog/browser-rum-react";

import { Provider } from "@/components/ui/provider.tsx";
import App from "@/App.tsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode.tsx";

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
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: true,
    enablePrivacyForActionName: true,
    plugins: [reactPlugin({ router: true })],
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>
          <App />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
