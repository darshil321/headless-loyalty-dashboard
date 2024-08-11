import { createApp } from "@shopify/app-bridge";

let appInstance: ReturnType<typeof createApp> | null = null;

export const getAppInstance = (host: string) => {
  if (!appInstance) {
    appInstance = createApp({
      apiKey: "540d2178130770d2fa72da8461f0de90",
      host,
    });
  }
  return appInstance;
};
