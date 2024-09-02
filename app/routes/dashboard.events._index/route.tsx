import { useNavigate } from "@remix-run/react";
import {
  Layout,
  Page,
  Button,
  Modal,
  IndexTable,
  useBreakpoints,
  useIndexResourceState,
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

const PointsType: any = {
  CREDIT: "Credit",
  DEBIT: "Debit",
};

const EventName: any = {
  ORDER_CREATE: "Create Order",
  SIGN_UP: "Sign Up",
};

export default function EventIndex() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(false);
  const [currentEventId, setCurrentEventId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = useAppSelector((state) => state.event.loyaltyEvents);
  const loading = useAppSelector((state) => state.event.loading);

  const handleDelete = (id: string) => {
    setActive(true);
    setCurrentEventId(id);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/event/${id}`);
  };

  const handleClose = () => {
    setActive(false);
  };

  const handleConfirmDelete = async () => {
    console.log("Deleting tier with ID:", currentEventId);
    try {
      await dispatch(deleteLoyaltyEvent(currentEventId));
      console.log("event deleted successfully");
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
    handleClose();
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(events || []);

  const rowMarkup = events?.map((event: any, index) => (
    <IndexTable.Row
      id={event.id}
      key={event.id}
      selected={selectedResources.includes(event.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {EventName[event.event]}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{event.tier.name}</IndexTable.Cell>
      <IndexTable.Cell>{PointsType[event.type]}</IndexTable.Cell>
      <IndexTable.Cell>
        {event.points + `${event.spendingType === "PERCENTAGE" ? "%" : ""}`}
      </IndexTable.Cell>
      <IndexTable.Cell>{event.expiresInDays + " days"}</IndexTable.Cell>
      <IndexTable.Cell>
        {event.status === "ACTIVE" ? "Active" : "Inactive"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {
          <div className="flex space-x-2" key={index}>
            <Button
              onClick={() => handleEdit(event.id)}
              icon={EditIcon}
              external
            />
            {event.event !== "SIGN_UP" && (
              <Button
                onClick={() => handleDelete(event.id)}
                icon={DeleteIcon}
                external
              />
            )}
          </div>
        }
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const resourceName = {
    singular: "event",
    plural: "events",
  };

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
      <Layout>
        <Layout.Section>
          <Card>
            <IndexTable
              condensed={useBreakpoints().smDown}
              resourceName={resourceName}
              itemCount={events.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Name" },
                { title: "Tier" },
                { title: "Type" },
                { title: "Value" },
                { title: "Expires In" },
                { title: "Status" },
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
      <SelectEventModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Page>
  );
}
