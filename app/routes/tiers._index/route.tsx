import { useNavigate } from "@remix-run/react";
import { Card, Layout, Page, DataTable, Button, Modal } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteLoyaltyTier, getAllLoyaltyTiers } from "@/store/tier/tierSlice";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";

export default function TiersIndex() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(false);
  const [currentTierId, setCurrentTierId] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);

  const tiers = useAppSelector((state) => state.tier.loyaltyTiers);

  const handleDelete = (id: string) => {
    setActive(true);
    setCurrentTierId(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/tiers/${id}`);
  };

  const handleClose = () => {
    setActive(false); // Close the modal
  };

  const handleConfirmDelete = async () => {
    console.log("Deleting tier with ID:", currentTierId);
    try {
      await dispatch(deleteLoyaltyTier(currentTierId));
      console.log("Tier deleted successfully");
    } catch (error) {
      console.error("Failed to delete tier:", error);
    }
    handleClose();
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
    if (!isDataFetched) {
      if (typeof window !== "undefined") {
        const storedConfig = JSON.parse(
          sessionStorage.getItem("app-bridge-config") || "{}",
        );
        const { host } = storedConfig;

        if (host) {
          setupAxiosInterceptors(host);
          setIsDataFetched(true);
        }
        dispatch(getAllLoyaltyTiers());
      }
    }
  }, [dispatch, isDataFetched]);

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
          <Modal
            open={active}
            onClose={handleClose}
            title="Delete tier"
            primaryAction={{
              content: "Delete",
              onAction: handleConfirmDelete,
              destructive: true,
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: handleClose,
              },
            ]}
          >
            <Modal.Section>
              <p>Do you want to delete this tier?</p>
            </Modal.Section>
          </Modal>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
