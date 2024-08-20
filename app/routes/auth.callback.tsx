import { authenticate } from "@/shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("In callback loader");
  return await authenticate.admin(request);
};

export default function Callback() {
  const log = useLoaderData();
  console.log("Callback log:", log);
  return null;
}
