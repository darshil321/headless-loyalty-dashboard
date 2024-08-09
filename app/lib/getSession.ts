/* eslint-disable react-hooks/rules-of-hooks */
import { useAppBridge } from "@shopify/app-bridge-react";

export const getMySessionToken = async () => {
  try {
    const app = useAppBridge();
    const sessionToken = await app.idToken();
    console.log("sessionToken", sessionToken);
    return sessionToken;
  } catch (error) {
    console.log("error", error);
  }
};
