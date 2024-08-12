import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Badge,
  BlockStack,
} from "@shopify/polaris";
import { useNavigate, useParams } from "@remix-run/react";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import {
  clearLoyaltyCustomer,
  getLoyaltyUserById,
} from "@/store/user/userSlice";
import { getLoyaltyTransactionByUserId } from "@/store/transaction/transactionSlice";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedCustomer = useAppSelector(
    (state: any) => state.user.selectedLoyaltyUser,
  );
  // const userTransactions = useAppSelector(
  //   (state: any) => state.transaction.loyaltyTransaction,
  // );

  const [showDialog, setShowDialog] = useState(false);

  let userTransactions = [
    {
      expiresAt: "2024-08-12 23:59:59",
      description: "Purchase of groceries",
      status: "Completed",
      pointsUsed: 100,
      type: "Debit",
    },
    {
      expiresAt: "2024-08-15 14:30:00",
      description: "Payment for online services",
      status: "Pending",
      pointsUsed: 50,
      type: "Credit",
    },
    {
      expiresAt: "2024-08-18 10:00:00",
      description: "Shopping spree",
      status: "Completed",
      pointsUsed: 200,
      type: "Debit",
    },
  ];

  const handleAdjustPoints = () => {
    setShowDialog(true);
  };

  const handleCreateEvent = () => {
    // Implement logic to create a new event
    setShowDialog(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);

      dispatch(clearLoyaltyCustomer());
      dispatch(getLoyaltyUserById(id)).catch((error: any) => {
        console.error("Error fetching user data:", error);
        navigate("/error");
      });
      dispatch(getLoyaltyTransactionByUserId(id));
    }

    return () => {
      dispatch(clearLoyaltyCustomer());
    };
  }, [id, dispatch, navigate]);

  if (!selectedCustomer) {
    return <h1>Loading...</h1>;
  }

  const transactionItems = userTransactions.map((transaction: any) => (
    <AccordionItem key={transaction.id} value={transaction.id}>
      <AccordionTrigger>
        {`${transaction.type === "DEBIT" ? "-" : "+"}${transaction.points} Points - ${new Date(transaction.createdAt).toLocaleDateString()}`}
      </AccordionTrigger>
      <AccordionContent>
        <BlockStack align="space-between">
          <Text as="p" variant="bodyMd">
            {transaction.description}
          </Text>
          <Badge>{transaction.type}</Badge>
        </BlockStack>
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap={"500"} align="space-between">
              <BlockStack gap={"300"} align="space-between">
                <Text as="h2" variant="headingMd">
                  Customer overview
                </Text>
              </BlockStack>
              <BlockStack gap={"200"} align="space-between">
                <Text as="p" variant="bodyMd">
                  Email: {selectedCustomer.email}
                </Text>
                <Text as="p" variant="bodyMd">
                  Name: {selectedCustomer.name}
                </Text>
                <Text as="p" variant="bodyMd">
                  Phone Number: {selectedCustomer.phoneNumber}
                </Text>
                <Text as="p" variant="bodyMd">
                  Birthday: {selectedCustomer.birthday}
                </Text>
                <Text as="p" variant="bodyMd">
                  Type: {selectedCustomer.type}
                </Text>
                <Text as="p" variant="bodyMd">
                  Customer Since: {selectedCustomer.customerSince}
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap={"200"} align="space-between">
              <Text as="h3" variant="bodyMd">
                Total Points: {selectedCustomer.totalPoints}
              </Text>
              <Button onClick={handleAdjustPoints}>Adjust Points</Button>
            </BlockStack>
          </Card>
          <Card>
            <Accordion collapsible type="single">
              {transactionItems}
            </Accordion>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap={"200"} align="space-between">
              <Text as="h2" variant="headingMd">
                Balance
              </Text>
              <BlockStack align="space-between">
                <Text as="h1" variant="headingMd">
                  Points: {selectedCustomer.totalPoints}
                </Text>
              </BlockStack>
              <Button onClick={() => console.log("Redeem Points")}>
                Redeem Points
              </Button>
              <Button onClick={() => console.log("Create Event")}>
                Create Event
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      {showDialog && (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertTitle>Adjust Points</AlertTitle>
            </AlertDialogHeader>

            <AlertDescription>
              {/* Add form fields for adjusting points */}
            </AlertDescription>

            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowDialog(false)}>
                Cancel
              </AlertDialogAction>
              <AlertDialogAction onClick={handleCreateEvent}>
                Create Event
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Page>
  );
}
