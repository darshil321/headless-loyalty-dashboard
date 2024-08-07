import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, Text } from "@shopify/polaris";
import EventForm from "../event/EventForm";

export default function Dashboard() {
  const StepEnum = {
    INITIAL: "initial",
    SELECT_STAGE: "SelectStage",
    SET_EVENT_DATA: "seteventdata",
    LIST_TABLE_STAGE: "TableView",
  };

  const [activeTab, setActiveTab] = useState("events");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventStage, setEventStage] = useState(StepEnum.INITIAL);

  const EventDisplay = () => {
    switch (eventStage) {
      case StepEnum.INITIAL:
        return (
          <Card className="p-4">
            <Text as="h1"> define rules</Text>
            <div className=" text-start mb-2">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor
              iusto consequuntur velit deserunt eius ipsam officia, quod,
              adipisci, hic facere atque! Autem sunt sit debitis accusantium
              sapiente, veritatis quae quibusdam? Qui laudantium odit in
              provident quidem, fugiat ut harum assumenda animi possimus
              asperiores fugit, rem commodi! Modi rerum ratione unde!
            </div>
            <div className=" w-full flex items-end justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  setEventStage(StepEnum.SELECT_STAGE);
                  setIsModalOpen(true);
                }}
                submit
              >
                select
              </Button>
            </div>
          </Card>
        );
      case StepEnum.SELECT_STAGE:
        return (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select an Option</DialogTitle>
                <DialogDescription>
                  Choose an option from the list below.
                </DialogDescription>
              </DialogHeader>
              <Select>
                <SelectTrigger id="options" aria-label="Options">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEventStage(StepEnum.SET_EVENT_DATA);
                  }}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      case StepEnum.SET_EVENT_DATA:
        return (
          <div id="define-rule" className="pt-4">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Celebrate Birthday</h2>
              </div>
              <Card className="border outline outline-1 p-4">
                <EventForm />
              </Card>
            </div>
          </div>
        );
      case StepEnum.LIST_TABLE_STAGE:
        return (
          <Card className="p-4">
            <Text as="h1"> define conditions</Text>

            <div className=" w-full flex items-end justify-end">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="Event"
                          />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <span>Celebrate Birthday</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>XX points</TableCell>
                      <TableCell>Within 30 days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="Event"
                          />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <span>Sign-Up</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Inactive</Badge>
                      </TableCell>
                      <TableCell>XX points</TableCell>
                      <TableCell>Within 30 days</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
              <Button variant="primary" submit>
                select
              </Button>
            </div>
          </Card>
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
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events">{EventDisplay()}</TabsContent>
          <TabsContent value="rules">
            {/* define rule table */}
            <div id="define-rule" className="pt-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Define Rules</h2>
                  <p className="text-muted-foreground">
                    Create new rules for your rewards program.
                  </p>
                </div>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="operations">Operations</Label>
                    <Input id="operations" placeholder="Enter operations" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="field1">Field 1</Label>
                      <Select id="field1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select field 1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="field2">Field 2</Label>
                      <Select id="field2">
                        <SelectTrigger>
                          <SelectValue placeholder="Select field 2" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="field3">Field 3</Label>
                      <Select id="field3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select field 3" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className=" w-full flex justify-end  items-end">
                    <Button variant="primary" submit>
                      Save Rule
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
