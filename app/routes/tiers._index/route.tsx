import { useNavigate } from "@remix-run/react";
import { Card, Layout, Page, DataTable, Button } from "@shopify/polaris";
import { useEffect } from "react";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllLoyaltyTiers } from "@/store/tier/tierSlice";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";

export default function TiersIndex() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const tiers = useAppSelector((state) => state.tier.loyaltyTiers);

  const handleDelete = (id: string) => {
    // Implementation for deleting a tier
    console.log("Deleting tier with ID:", id);
    // You might call a function here that makes an API request to delete the tier
  };

  const handleEdit = (id: string) => {
    navigate(`/tiers/${id}`);
  };

  const rows = tiers?.map((tier: any, index) => [
    tier.name,
    tier.default === true ? "Default" : "Custom",
    tier.status,
    <div className="flex space-x-2" key={index}>
      <Button onClick={() => handleEdit(tier.id)} icon={EditIcon} external />
      <Button
        onClick={() => handleDelete(tier.id)}
        icon={DeleteIcon}
        external
      />
    </div>,
  ]);

  useEffect(() => {
    // Ensure sessionStorage is accessed only client-side
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getAllLoyaltyTiers());
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
            <DataTable
              columnContentTypes={["text", "text", "text", "text"]}
              headings={["Name", "Type", "Status", "Actions"]}
              rows={rows}
              showTotalsInFooter={true}
              sortable={[false, false, true, false]}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
