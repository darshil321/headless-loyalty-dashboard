import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Badge,
  InlineGrid,
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
      id: "#2o8i30lnlkdlf",
      expiresAt: "2024-08-12 23:59:59",
      description: "Purchase of groceries",
      status: "Completed",
      pointsUsed: 100,
      type: "DEBIT",
    },
    {
      id: "#98798423ihoi",
      expiresAt: "2024-08-15 14:30:00",
      description: "Payment for online services",
      status: "Pending",
      pointsUsed: 50,
      type: "CREDIT",
    },
    {
      id: "#8u98u492jhkj",
      expiresAt: "2024-08-18 10:00:00",
      description: "Shopping spree",
      status: "Completed",
      pointsUsed: 200,
      type: "CREDIT",
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

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <BlockStack gap={"600"} align="space-between">
            <Card>
              <BlockStack gap={"600"} align="space-between">
                <BlockStack gap={"300"} align="space-between">
                  <Text as="h2" variant="headingLg">
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
              <BlockStack gap={"400"} align="space-between">
                <BlockStack gap={"300"} align="space-between">
                  <Text as="h2" variant="headingLg">
                    Transaction
                  </Text>
                </BlockStack>
                <Accordion type="single" collapsible>
                  {userTransactions.map((transaction: any, index: number) => (
                    <AccordionItem key={index} value={transaction.pointsUsed}>
                      <AccordionTrigger className="cursor-pointer no-underline ">
                        <Text as="h4" variant="headingMd">
                          {transaction?.id}
                          <span className="ml-2">
                            <Badge
                              tone={
                                transaction?.type === "DEBIT"
                                  ? "critical"
                                  : "success"
                              }
                            >
                              {`${transaction.type === "DEBIT" ? "-" : "+"}${
                                transaction?.pointsUsed
                              } `}
                            </Badge>
                          </span>
                        </Text>
                      </AccordionTrigger>
                      <AccordionContent>
                        <BlockStack align="space-between" gap={"200"}>
                          <InlineGrid columns="1fr auto">
                            <Text as="p" variant="bodyMd">
                              <b>Expires at</b>
                            </Text>
                            <Text as="p" variant="bodyMd">
                              {transaction?.expiresAt}
                            </Text>
                          </InlineGrid>
                          <InlineGrid columns="1fr auto">
                            <Text as="p" variant="bodyMd">
                              <b>Type</b>
                            </Text>
                            <Text as="p" variant="bodyMd">
                              {transaction?.type}
                            </Text>
                          </InlineGrid>
                          <InlineGrid columns="1fr auto">
                            <Text as="p" variant="bodyMd">
                              <b>description</b>
                            </Text>
                            <Text as="p" variant="bodyMd">
                              {transaction?.description}
                            </Text>
                          </InlineGrid>
                          <InlineGrid columns="1fr auto">
                            <Text as="p" variant="bodyMd">
                              <p>status</p>
                            </Text>
                            <Text as="p" variant="bodyMd">
                              <Badge tone="success">
                                {transaction?.status}
                              </Badge>
                            </Text>
                          </InlineGrid>
                          <InlineGrid columns="1fr auto">
                            <Text as="p" variant="bodyMd">
                              <b>pointsUsed</b>
                            </Text>
                            <Text as="p" variant="bodyMd">
                              {transaction?.pointsUsed}
                            </Text>
                          </InlineGrid>
                        </BlockStack>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap={"200"} align="space-between">
              <Text as="h2" variant="headingMd">
                Balance
              </Text>
              <BlockStack align="space-between">
                <Text as="h1" variant="headingXl">
                  {selectedCustomer.totalPoints} Points
                </Text>
              </BlockStack>
              <Text as="h2" variant="bodyMd">
                Total Points Earned : {selectedCustomer.totalPoints}
              </Text>
              <Text as="h2" variant="bodyMd">
                Total Points Redeemed : {selectedCustomer.totalPoints}
              </Text>

              <InlineGrid columns="1fr 1fr" gap="200">
                <Button
                  variant="primary"
                  onClick={() => console.log("Redeem Points")}
                >
                  Redeem Points
                </Button>

                <Button onClick={handleAdjustPoints}>Adjust Points</Button>
              </InlineGrid>
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
