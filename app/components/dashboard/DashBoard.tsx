import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("events");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <h1 className="text-xl font-bold">Logo of app</h1>
      </header>
      <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex space-x-4 border-b">
            <div
              className={activeTab === "events" ? "pb-2 font-semibold" : "pb-2"}
            >
              Events
            </div>
            <div
              className={activeTab === "rules" ? "pb-2 font-semibold" : "pb-2"}
            >
              Rules
            </div>
            <div
              className={
                activeTab === "conditions" ? "pb-2 font-semibold" : "pb-2"
              }
            >
              Conditions
            </div>
            <div
              className={
                activeTab === "benefits" ? "pb-2 font-semibold" : "pb-2"
              }
            >
              Benefits
            </div>
          </div>
          <div>
            <div>
              <div className="flex justify-between items-center py-4">
                <h2 className="text-lg font-semibold">Events</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                  Add ways to earn
                </Button>
              </div>
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
            </div>
            <div>
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
                  <Button type="submit">Save Rule</Button>
                </form>
              </div>
            </div>
            <div>Conditions content</div>
            <div>Benefits content</div>
          </div>
        </Tabs>
      </main>
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
            <Button onClick={() => setIsModalOpen(false)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
