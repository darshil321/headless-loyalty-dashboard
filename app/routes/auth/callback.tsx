import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const accessToken = session.accessToken;

  console.log("accessToken", accessToken);

  // Send the access token to your AWS Lambda backend
  const response = await fetch(
    "https://your-backend-url.com/store-access-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to store access token");
  }

  // Redirect to the app's main page after installation
  return redirect(`/`);
}
