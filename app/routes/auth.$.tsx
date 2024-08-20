import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("hiiie in index loader 3");

  return authenticate.admin(request);
};

export default function Index() {
  const loderdata = useLoaderData<typeof loader>();
  console.log("loaderdata", loderdata);
  return null;
}
