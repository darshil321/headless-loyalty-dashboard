import LoyaltyEventOrderCreateForm from "@/components/event/LoyaltyEventOrderCreateForm";
import LoyaltyEventSignupForm from "@/components/event/LoyaltyEventSignupForm";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import {
  clearSelectedLoyaltyEvent,
  getLoyaltyEventById,
} from "@/store/event/eventSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const LoyaltyEvent = useAppSelector(
    (state) => state.event.selectedLoyaltyEvent,
  );
  console.log("LoyaltyEvent", LoyaltyEvent);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getLoyaltyEventById(eventId)).catch((error: any) => {
        console.log("Error fetching event data:", error);
        navigate("/error");
      });
    }

    return () => {
      dispatch(clearSelectedLoyaltyEvent());
    };
  }, [eventId, dispatch]);

  if (!LoyaltyEvent) {
    return <div>Loading...</div>;
  }

  if (LoyaltyEvent.event === "SIGN_UP") {
    return <LoyaltyEventSignupForm eventData={LoyaltyEvent} isUpdate />;
  } else if (LoyaltyEvent.event === "ORDER_CREATE") {
    return <LoyaltyEventOrderCreateForm eventData={LoyaltyEvent} isUpdate />;
  }
}
