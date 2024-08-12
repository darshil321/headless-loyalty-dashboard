import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { Page, Layout, Text, Card, BlockStack, Link } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useAppDispatch } from "@/store/hooks";
import { setSessionToken } from "@/store/session/sessionSlice";
import axios from "axios";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  await axios.post(process.env.BACKEND_URL + "/shopify/app-integration" || "", {
    accessToken: session.accessToken,
    store: session.shop,
  });
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
};

export default function Index() {
  const dispatch = useAppDispatch();

  const shopify = useAppBridge();
  useEffect(() => {
    shopify.idToken().then((res) => {
      console.log("res", res);
      dispatch(setSessionToken(res));
    });
  }, []);

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Congrats Parth a new Shopify app 🎉
                  </Text>
                  <Text variant="bodyMd" as="p">
                    This embedded app template uses{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                      removeUnderline
                    >
                      App Bridge
                    </Link>{" "}
                    interface examples like an{" "}
                    <Link url="/app/additional" removeUnderline>
                      additional page in the app nav
                    </Link>
                    , as well as an{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql"
                      target="_blank"
                      removeUnderline
                    >
                      Admin GraphQL
                    </Link>{" "}
                    mutation demo, to provide a starting point for app
                    development.
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
