import LotaltyEventForm from "@/components/event/LotaltyEventForm";
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
    return <div>Loadifffng...</div>;
  }

  return <LotaltyEventForm eventData={LoyaltyEvent} isUpdate />;
}
