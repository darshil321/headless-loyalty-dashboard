import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Badge,
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

  console.log("userTransactions", userTransactions);

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

  const transactionItems = userTransactions?.map((transaction: any) => (
    <AccordionItem key={transaction.id} value={transaction.id}>
      <AccordionTrigger>
        <div className="flex justify-between w-full pt-2">
          <div>
            {`${transaction.type === "DEBIT" ? "-" : "+"}${transaction.points} Points ${transaction.type === "CREDIT" ? "- Expires At " + new Date(transaction.expiresAt).toLocaleDateString() : ""}`}
          </div>
          <div>{`${transaction.status}`}</div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <BlockStack>
          <Text as="p" variant="bodyMd">
            {transaction.description}
          </Text>

          <div className="py-2">
            <Badge
              tone={transaction.type === "DEBIT" ? "critical" : "success"}
              size="large"
            >
              {transaction.type}
            </Badge>
          </div>
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
                  UserId: {selectedCustomer.wallet.userId}
                </Text>
                <Text as="p" variant="bodyMd">
                  Tier: {selectedCustomer.tier.name}
                </Text>
                {/* <Text as="p" variant="bodyMd">
                  Name: {selectedCustomer.name}
                </Text> */}
                {/* <Text as="p" variant="bodyMd">
                  Phone Number: {selectedCustomer.phoneNumber}
                </Text> */}
                {/* <Text as="p" variant="bodyMd">
                  Birthday: {selectedCustomer.birthday}
                </Text> */}
                {/* <Text as="p" variant="bodyMd">
                  Type: {selectedCustomer.type}
                </Text>
                <Text as="p" variant="bodyMd">
                  Customer Since: {selectedCustomer.customerSince}
                </Text> */}
              </BlockStack>
            </BlockStack>
          </Card>

          <div className="mt-5">
            <Card>
              <Text as="h2" variant="headingMd">
                Transactions
              </Text>
              <Accordion collapsible type="single">
                {transactionItems}
              </Accordion>
            </Card>
          </div>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap={"200"} align="space-between">
              {/* <Text as="h2" variant="headingMd">
                Balance
              </Text>
              <Text as="h2" variant="bodyMd">
                Balance data
              </Text>
              <Text as="h2" variant="bodyMd">
                Balance data
              </Text> */}
              <BlockStack align="space-between">
                <Text as="h1" variant="headingLg">
                  Points: {selectedCustomer.wallet.totalPoints}
                </Text>
              </BlockStack>
              {/* <Button onClick={() => console.log("Redeem Points")}>
                Redeem Points
              </Button>

              <Button onClick={handleAdjustPoints}>Adjust Points</Button> */}
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
