import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EventForm from "@/components/event/EventForm";
import { Button } from "@/components/ui/button";
import { SelectEventForm } from "@/components/common/SelectEventForm";
import EventsTable from "@/components/event/EventsTable";
import EventRules from "@/components/event/EventRules";
import EventBenefits from "@/components/event/EventBenefits";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getMySessionToken } from "@/lib/getSession";
import { useAppSelector } from "@/store/hooks";
import { authenticate } from "@/shopify.server";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";

export const StepEnum = {
  INITIAL: "initial",
  SET_EVENT_DATA: "seteventdata",
  LIST_TABLE_STAGE: "TableView",
};

type EventDetails = {
  backendValue: string;
  frontendValue: string;
};

export const EventEnum: Record<string, EventDetails> = {
  SIGN_UP: {
    backendValue: "SIGN_UP",
    frontendValue: "Sign Up",
  },
  ORDER_CREATE: {
    backendValue: "ORDER_CREATE",
    frontendValue: "Order Create",
  },
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return { sessionToken: session.accessToken };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const sessionToken = session.accessToken;

  const response = await fetch(
    "https://webhook.site/3c49c04d-a03b-4efb-b64f-c96602209290",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken }),
    },
  );

  return { success: response.ok };
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventStage, setEventStage] = useState(StepEnum.INITIAL);
  const storedSessionToken = useAppSelector(
    (state) => state.session.sessionToken,
  );
  const loaderData = useLoaderData();
  console.log("loaderData", loaderData);
  console.log("storedSessionToken", storedSessionToken);

  // const sessionToken = getMySessionToken();
  // console.log("sessionToken", sessionToken);
  // const appBridge = useAppBridge();
  // console.log("appBridge", appBridge);
  // let sessionToken;
  // const shopify = useAppBridge();
  // useEffect(() => {
  //   shopify.idToken().then((res) => {
  //     console.log("res", res);
  //     sessionToken = res;
  //   });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://9offq7b4x6.execute-api.us-east-2.amazonaws.com/v1/loyalty_tier_events",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedSessionToken}`,
            },
          },
        );
        const data = await response.json();
        console.log("datareal", data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const submit = useSubmit();

  const handleActionClick = () => {
    submit(null, { method: "POST" });
  };

  const EventDisplay = () => {
    switch (eventStage) {
      case StepEnum.INITIAL:
        return (
          <Card className="p-4">
            <h2>Define Rules</h2>
            <div className=" text-start mb-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor
              iusto consequuntur velit deserunt eius ipsam officia, quod,
              adipisci, hic facere atque! Autem sunt sit debitis accusantium
              sapiente, veritatis quae quibusdam?
            </div>
            <div className=" w-full flex items-end justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className=" bg-black text-white"
                type="submit"
              >
                select
              </Button>
            </div>
          </Card>
        );
      case StepEnum.SET_EVENT_DATA:
        return (
          <div id="define-rule" className="pt-4">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Celebrate Birthday</h2>
              </div>
              <Card className=" p-4">
                <EventForm setEventStage={setEventStage} />
              </Card>
            </div>
          </div>
        );
      case StepEnum.LIST_TABLE_STAGE:
        return (
          <div>
            <EventsTable />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <h1 className="text-xl font-bold">Logo of app</h1>
      </header>
      <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
        <Tabs
          value={activeTab}
          defaultValue={"events"}
          onValueChange={setActiveTab}
        >
          <div className="flex space-x-4 border-b">
            <TabsList>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events">{EventDisplay()}</TabsContent>
          <TabsContent value="rules">
            <EventRules />
            <Button onClick={handleActionClick} className="bg-black text-white">
              Fire Action
            </Button>
          </TabsContent>
          <TabsContent value="benefits">
            <EventBenefits />
          </TabsContent>
        </Tabs>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select an Option</DialogTitle>
              <DialogDescription>
                Choose an option from the list below.
              </DialogDescription>
            </DialogHeader>
            <SelectEventForm
              setEventStage={setEventStage}
              setIsModalOpen={setIsModalOpen}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
