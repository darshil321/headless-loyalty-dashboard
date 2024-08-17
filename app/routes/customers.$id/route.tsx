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
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";

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

const statusMap: any = {
  NO_SPENT: "Not Used",
  PARTIALLY_SPENT: "Partially Used",
  FULL_SPENT: "Fully Used",
  EXPIRED: "Expired",
  DEBITED: "DEBITED",
};

const statusColorMap: any = {
  EXPIRED: "critical-strong",
  NO_SPENT: "info",
  PARTIALLY_SPENT: "magic",
  FULL_SPENT: "success-strong",
  DEBITED: "warning-strong",
};

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const selectedCustomer = useAppSelector(
    (state: any) => state.user.selectedLoyaltyUser,
  );
  const userTransactions = useAppSelector(
    (state: any) => state.transaction.selectedLoyaltyTransaction,
  );

  const [showDialog, setShowDialog] = useState(false);

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
      dispatch(getLoyaltyTransactionByUserId(userId));
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
          <Card>
            <BlockStack gap={"600"} align="space-between">
              <BlockStack gap={"300"} align="space-between">
                <Text as="h2" variant="headingLg">
                  Customer overview
                </Text>
              </BlockStack>
              <BlockStack gap={"200"} align="space-between">
                <Text as="p" variant="bodyMd">
                  <b>Email: </b> {selectedCustomer.wallet.email}
                </Text>
                <Text as="p" variant="bodyMd">
                  <b>CustomerId: </b> {selectedCustomer.wallet.userId}
                </Text>
                <Text as="p" variant="bodyMd">
                  <b>Tier :</b> {selectedCustomer.tier.name}
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>

          <div className="mt-4">
            <Card>
              <BlockStack gap={"400"} align="space-between">
                <BlockStack gap={"300"} align="space-between">
                  <Text as="h2" variant="headingLg">
                    Transactions
                  </Text>
                </BlockStack>
                <Accordion type="single" collapsible>
                  {userTransactions?.map((transaction: any, index: number) => {
                    const isoDate = transaction?.expiresAt;
                    const currentDate: any = new Date();
                    const givenDate: any = new Date(isoDate);
                    const diffTime = givenDate - currentDate;
                    return (
                      <AccordionItem key={index} value={String(index)}>
                        {" "}
                        {/* Ensure unique value */}
                        <AccordionTrigger className="cursor-pointer no-underline ">
                          <div className="w-full flex justify-between p-2">
                            <p>{transaction?.id.substring(0, 18)}</p>
                            <Text as="h4" variant="headingMd">
                              <span className="ml-2">
                                <Badge
                                  tone={
                                    transaction?.type === "DEBIT"
                                      ? "critical"
                                      : "success"
                                  }
                                >
                                  {`${transaction?.type === "DEBIT" ? "-" : "+"}${transaction?.points}`}
                                </Badge>
                              </span>
                            </Text>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <BlockStack align="space-between" gap={"200"}>
                            <InlineGrid columns="1fr auto">
                              <Text as="p" variant="bodyMd">
                                <b>Expires In</b>
                              </Text>
                              <Text as="p" variant="bodyMd">
                                {transaction?.status === statusMap.DEBITED
                                  ? 0 + " days"
                                  : // Convert time difference from milliseconds to days
                                    Math.ceil(
                                      diffTime / (1000 * 60 * 60 * 24),
                                    ) + " days"}
                              </Text>
                            </InlineGrid>

                            <InlineGrid columns="1fr auto">
                              <Text as="p" variant="bodyMd">
                                <b>Description</b>
                              </Text>
                              <Text as="p" variant="bodyMd">
                                {transaction?.description}
                              </Text>
                            </InlineGrid>
                            <InlineGrid columns="1fr auto">
                              <Text as="p" variant="bodyMd">
                                <b>Status</b>
                              </Text>
                              <Text as="p" variant="bodyMd">
                                <Badge
                                  tone={statusColorMap[transaction?.status]}
                                >
                                  {statusMap[transaction?.status]}
                                </Badge>
                              </Text>
                            </InlineGrid>
                            {/* <InlineGrid columns="1fr auto">
                          <Text as="p" variant="bodyMd">
                            <b>pointsUsed</b>
                          </Text>
                          <Text as="p" variant="bodyMd">
                            {transaction?.pointsUsed}
                          </Text>
                        </InlineGrid> */}
                          </BlockStack>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap={"200"} align="space-between">
              <Text as="h2" variant="headingMd">
                Balance
              </Text>
              <BlockStack align="space-between">
                <Text as="h1" variant="headingXl">
                  {selectedCustomer.wallet.totalPoints} Points
                </Text>
              </BlockStack>
              {/* <Text as="h2" variant="bodyMd">
                Total Points Earned : {selectedCustomer.totalPoints}
              </Text>
              <Text as="h2" variant="bodyMd">
                Total Points Redeemed : {selectedCustomer.totalPoints}
              </Text> */}

              {/* <InlineGrid columns="1fr 1fr" gap="200">
                <Button
                  variant="primary"
                  onClick={() => console.log("Redeem Points")}
                >
                  Redeem Points
                </Button>

                <Button onClick={handleAdjustPoints}>Adjust Points</Button>
              </InlineGrid> */}
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
