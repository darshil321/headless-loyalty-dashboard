import { useParams } from "@remix-run/react";
import TierForm from "@/components/tiers/tier-form";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLoyaltyTierById } from "@/store/tier/tierSlice";
import { useAppSelector } from "@/store/hooks";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";

export default function EditTier() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedLoyaltyTier = useAppSelector(
    (state: any) => state.tier.selectedLoyaltyTier,
  );

  const fetchLoyaltyTierById = async () => {
    try {
      await dispatch(getLoyaltyTierById(id));
    } catch (error) {
      console.error("Error fetching tier data:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      fetchLoyaltyTierById();
    }
  }, [dispatch]);

  if (!selectedLoyaltyTier) return <h1>Loading</h1>;

  return <TierForm tierData={selectedLoyaltyTier} isUpdate />;
}
