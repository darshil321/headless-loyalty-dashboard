import { useNavigate } from "@remix-run/react";
import {
  Layout,
  Page,
  DataTable,
  Button,
  Modal,
  BlockStack,
  Text,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import {
  deleteLoyaltyEvent,
  getAllLoyaltyEvents,
} from "@/store/event/eventSlice";
import SelectEventModal from "@/components/common/SelectEventModal";
import { Card } from "@/components/ui/card";

export default function EventIndex() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(false);
  const [currentEventId, setCurrentEventId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = useAppSelector((state) => state.event.loyaltyEvents);

  const handleDelete = (id: string) => {
    setActive(true);
    setCurrentEventId(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/event/${id}`);
  };

  const handleClose = () => {
    setActive(false); // Close the modal
  };

  const handleConfirmDelete = async () => {
    console.log("Deleting tier with ID:", currentEventId);
    // Call the deletion API or dispatch a Redux action
    // Assume async operation:
    try {
      await dispatch(deleteLoyaltyEvent(currentEventId));
      console.log("event deleted successfully");
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
    handleClose(); // Close the modal after action
  };

  const rows = events?.map((event: any, index) => [
    event.event,
    event.type,
    event.tier.name,
    event.points,
    new Date(event.expiryDate).toLocaleDateString(),
    <div className="flex space-x-2" key={index}>
      <Button onClick={() => handleEdit(event.id)} icon={EditIcon} external />
      <Button
        onClick={() => handleDelete(event.id)}
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
      dispatch(getAllLoyaltyEvents());
    }
  }, []);

  return (
    <Page
      title="Events"
      primaryAction={{
        content: "Create event",
        onAction: () => {
          setIsModalOpen(true);
          console.log("isModalOpen", isModalOpen);
        },
      }}
    >
      {events?.length === 0 ? (
        <main>
          <Card className="p-4">
            <BlockStack gap={"400"}>
              <BlockStack gap={"300"}>
                <Text variant="headingMd" as="h2">
                  Define Events
                </Text>
              </BlockStack>
              <div className="text-start mb-2">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor
                iusto consequuntur velit deserunt eius ipsam officia, quod,
                adipisci, hic facere atque! Autem sunt sit debitis accusantium
                sapiente, veritatis quae quibusdam?
              </div>
              {/* <div className="w-full flex items-end justify-end">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  select
                </Button>
              </div> */}
            </BlockStack>
          </Card>
        </main>
      ) : (
        <Layout>
          <Layout.Section>
            <Card>
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text"]}
                headings={[
                  "Name",
                  "Type",
                  "Tier",
                  "Points",
                  "Expiry",
                  "Actions",
                ]}
                rows={rows}
                showTotalsInFooter={true}
                sortable={[false, false, true, false]}
              />
            </Card>
            <Modal
              open={active}
              onClose={handleClose}
              title="Delete event"
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
                <p>Do you want to delete this event?</p>
              </Modal.Section>
            </Modal>
          </Layout.Section>
        </Layout>
      )}
      <SelectEventModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Page>
  );
}
