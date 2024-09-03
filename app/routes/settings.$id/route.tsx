import { useNavigate, useParams } from "@remix-run/react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import CouponForm from "@/components/settings/coupon-form";
import EventMatchingForm from "@/components/settings/event-maching-form";
import TierUpdationForm from "@/components/settings/tier-update-form";
import {
  clearLoyaltyConfig,
  getLoyaltyConfigById,
} from "@/store/config/configSlice";

const configKeyMap: any = {
  COUPON: "COUPON",
  EVENT_MATCH: "EVENT_MATCH",
  TIER_UPDATE: "TIER_UPDATE",
};

export default function EditSetting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedLoyaltyConfig = useAppSelector(
    (state: any) => state.config.selectedLoyaltyConfig,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(clearLoyaltyConfig()); // Clear previous tier data right before fetching new
      dispatch(getLoyaltyConfigById(id)).catch((error: any) => {
        console.error("Error fetching tier data:", error);
        navigate("/error"); // navigate to an error page or handle the error appropriately
      });
    }

    // Cleanup function to reset the tier data when component unmounts
    return () => {
      dispatch(clearLoyaltyConfig());
    };
  }, [id, dispatch, navigate]);

  if (!selectedLoyaltyConfig) {
    return <h1>Loading...</h1>; // Ensure a clear loading state is shown each time
  }

  if (selectedLoyaltyConfig.key === configKeyMap.COUPON) {
    return <CouponForm config={selectedLoyaltyConfig} />;
  } else if (selectedLoyaltyConfig.key === configKeyMap.EVENT_MATCH) {
    return <EventMatchingForm config={selectedLoyaltyConfig} />;
  } else if (selectedLoyaltyConfig.key === configKeyMap.TIER_UPDATE) {
    return <TierUpdationForm config={selectedLoyaltyConfig} />;
  }
}
