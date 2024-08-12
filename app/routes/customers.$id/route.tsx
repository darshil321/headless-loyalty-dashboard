import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppSelector } from "@/store/hooks";
import { getLoyaltyTransactionByUserId } from "@/store/transaction/transactionSlice";
import {
  clearLoyaltyCustomer,
  getLoyaltyUserById,
} from "@/store/user/userSlice";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function CustomerDetails() {
  const { id } = useParams();
  console.log("id", id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedCustomer = useAppSelector(
    (state: any) => state.user.selectedLoyaltyUser,
  );
  const userTransactions = useAppSelector(
    (state: any) => state.transaction.loyaltyTransaction,
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

      dispatch(clearLoyaltyCustomer()); // Clear previous tier data right before fetching new
      dispatch(getLoyaltyUserById(id)).catch((error: any) => {
        console.error("Error fetching user data:", error);
        navigate("/error"); // navigate to an error page or handle the error appropriately
      });
      // get loyalty transactions by id
      dispatch(getLoyaltyTransactionByUserId(id));
    }

    // Cleanup function to reset the tier data when component unmounts
    return () => {
      dispatch(clearLoyaltyCustomer());
    };
  }, [id, dispatch, navigate]);

  console.log("selectedCustomer", selectedCustomer);
  console.log("userTransactions", userTransactions);

  if (!selectedCustomer) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardHeader>Overview</CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Email</span>
                <span>abc@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span>Name</span>
                <span>abc</span>
              </div>
              <div className="flex justify-between">
                <span>Phone Number</span>
                <span>+91 8281918191</span>
              </div>
              <div className="flex justify-between">
                <span>Birthday</span>
                <span>DD/MM/YYYY</span>
              </div>
              <div className="flex justify-between">
                <span>Type</span>
                <span>Guest</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Since</span>
                <span>XX months ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Balance</CardHeader>
          <CardContent className="text-4xl font-bold">10 Points</CardContent>
          <CardFooter className="flex justify-between">
            <span>Total points earned: 100</span>
            <span>Total points redeemed: 90</span>
          </CardFooter>
          <div className="flex justify-end space-x-2">
            <button className="btn btn-primary" onClick={handleAdjustPoints}>
              Adjust Points
            </button>
            <button className="btn btn-secondary">Redeem</button>
          </div>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader>Transactions</CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-red-500">-200</span>
                  <span className="ml-2">DD/MM/YYYY</span>
                </div>
                <span>Lorem Ipsum</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-500">+20</span>
                  <span className="ml-2">DD/MM/YYYY</span>
                </div>
                <span>Lorem Ipsum</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-500">+200</span>
                  <span className="ml-2">DD/MM/YYYY</span>
                </div>
                <span>Lorem Ipsum</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
