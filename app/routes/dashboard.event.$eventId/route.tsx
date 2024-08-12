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
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedTierEvent = useAppSelector(
    (state) => state.event.selectedLoyaltyEvent,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getLoyaltyEventById(id)).catch((error: any) => {
        console.log("Error fetching event data:", error);
        navigate("/error");
      });
    }

    return () => {
      dispatch(clearSelectedLoyaltyEvent());
    };
  }, [id]);

  if (!selectedTierEvent) {
    return <div>Loading...</div>;
  }

  return <LotaltyEventForm eventData={selectedTierEvent} isUpdate />;
}
