import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllLoyaltyEvents } from "@/store/event/eventSlice";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { Layout } from "@shopify/polaris";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.event.loyaltyEvents);
  console.log("events", events);

  useEffect(() => {
    // Ensure sessionStorage is accessed only client-side
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getAllLoyaltyEvents());
    }
  }, [dispatch]);

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen">
        <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
          <h1 className="text-xl font-bold">Logo of app</h1>
        </header>
      </div>
    </Layout>
  );
}
