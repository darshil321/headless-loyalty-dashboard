import { useNavigate } from "@remix-run/react";
import {
  Card,
  Layout,
  Page,
  Button,
  Modal,
  IndexTable,
  useIndexResourceState,
  Text,
  useBreakpoints,
} from "@shopify/polaris";
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
    // Call the deletion API or dispatch a Redux action
    // Assume async operation:
    try {
      await dispatch(deleteLoyaltyTier(currentTierId));
      console.log("Tier deleted successfully");
    } catch (error) {
      console.error("Failed to delete tier:", error);
    }
    handleClose(); // Close the modal after action
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(tiers || []);
  const loading = useAppSelector((state) => state.tier.loading);

  const rowMarkup = tiers?.map((tier: any, index) => (
    <IndexTable.Row
      id={tier.id}
      key={tier.id}
      selected={selectedResources.includes(tier.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {tier?.name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {tier.default === true ? "Default" : "Custom"}
      </IndexTable.Cell>
      <IndexTable.Cell>{tier.status}</IndexTable.Cell>
      <IndexTable.Cell>
        <div className="flex space-x-2" key={index}>
          <Button
            onClick={() => handleEdit(tier.id)}
            icon={EditIcon}
            external
          />
          <Button
            onClick={() => handleDelete(tier.id)}
            icon={DeleteIcon}
            external
          />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const resourceName = {
    singular: "tier",
    plural: "tiers",
  };

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
            <IndexTable
              condensed={useBreakpoints().smDown}
              resourceName={resourceName}
              itemCount={tiers.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "User Id" },
                { title: "Points" },
                { title: "Tier" },
                { title: "Actions" },
              ]}
              loading={loading}
              pagination={{ hasPrevious: false, hasNext: false }}
            >
              {rowMarkup}
            </IndexTable>
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
