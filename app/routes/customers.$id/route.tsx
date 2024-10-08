import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppSelector } from "@/store/hooks";
import { getLoyaltyTransactionByUserId } from "@/store/transaction/transactionSlice";
import {
  clearLoyaltyCustomer,
  getLoyaltyUserById,
} from "@/store/user/userSlice";
import { useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedCustomer = useAppSelector(
    (state: any) => state.user.selectedLoyaltyUser,
  );
  const userTransactions = useAppSelector(
    (state: any) => state.transaction.loyaltyTransaction,
  );

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

  return <div>Customer Details</div>;
}
