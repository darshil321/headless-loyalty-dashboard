import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import axios from "axios";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  await axios.post(process.env.BACKEND_URL + "/shopify/app-integration" || "", {
    accessToken: session.accessToken,
    store: session.shop,
  });
  return null;
};
