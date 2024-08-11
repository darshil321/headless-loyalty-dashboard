import { useNavigate, useParams } from "@remix-run/react";
import TierForm from "@/components/tiers/tier-form";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearLoyaltyTier, getLoyaltyTierById } from "@/store/tier/tierSlice";
import { useAppSelector } from "@/store/hooks";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";

export default function EditTier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedLoyaltyTier = useAppSelector(
    (state: any) => state.tier.selectedLoyaltyTier,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(clearLoyaltyTier()); // Clear previous tier data right before fetching new
      dispatch(getLoyaltyTierById(id)).catch((error: any) => {
        console.error("Error fetching tier data:", error);
        navigate("/error"); // navigate to an error page or handle the error appropriately
      });
    }

    // Cleanup function to reset the tier data when component unmounts
    return () => {
      dispatch(clearLoyaltyTier());
    };
  }, [id, dispatch, navigate]);

  if (!selectedLoyaltyTier) {
    return <h1>Loading...</h1>; // Ensure a clear loading state is shown each time
  }
  return <TierForm tierData={selectedLoyaltyTier} isUpdate />;
}
