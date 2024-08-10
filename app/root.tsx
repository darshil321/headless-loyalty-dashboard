import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "@shopify/polaris/build/esm/styles.css";
import "./globals.css";
import { cn } from "./lib/utils";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <link rel="stylesheet" href="styles.css" />
        <Meta />
        <Links />
      </head>
      <body className={cn("antialiased")}>
        <Provider store={store}>
          <AppProvider i18n={enTranslations}>
            <Outlet />
            <ScrollRestoration />
            <Toaster />
            <Scripts />
          </AppProvider>
        </Provider>
      </body>
    </html>
  );
}
