import { Link, useNavigate } from "@remix-run/react";
// import { Page, Card, Button, DataTable } from "@shopify/polaris";
import { Card, Layout, Page, Text, DataTable } from "@shopify/polaris";
import { listTiersAPI } from "@/api/tiers/list-tiers";
import { useEffect, useState } from "react";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch } from "@/store/hooks";

export default function TiersIndex() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tiers, setTiers] = useState([]);

  const fetchTiersApi = async () => {
    const tiers = await listTiersAPI();
    console.log("tiers", tiers);
    setTiers(tiers);
    // dispatch(setTiers(tiers));
    return tiers;
  };

  // const tiers = useAppSelector((state) => state.tiers.tiers);

  const rows = tiers?.map((tier: any) => [
    tier.name,
    tier.status,
    tier.description,
    <Link key={tier.id} to={`/tiers/${tier.id}`}>
      Edit
    </Link>,
  ]);

  useEffect(() => {
    // Ensure sessionStorage is accessed only client-side
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      fetchTiersApi();
    }
  }, []);

  return (
    <Page
      title="Tiers"
      primaryAction={{
        content: "Create Tier",
        onAction: () => navigate("/tiers/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Text variant="headingMd" as="h5">
              Tiers
            </Text>
            <DataTable
              columnContentTypes={["text", "text", "text", "text"]}
              headings={["Name", "Status", "Description", "Actions"]}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
