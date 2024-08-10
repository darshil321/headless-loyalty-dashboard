import { Card, Layout, Page, Text } from "@shopify/polaris";
import React from "react";

const route = () => {
  return (
    <div>
      <Page title="Tiers">
        <Layout>
          <Layout.Section>
            <Card>
              <Text variant="headingMd" as="h5">
                Tiers
              </Text>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
};

export default route;
