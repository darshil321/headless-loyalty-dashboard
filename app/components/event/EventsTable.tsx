import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";

const EventsTable = ({ events }: { events: any }) => {
  return (
    <div className="w-full flex flex-col h-fit">
      <div className="w-full flex justify-end my-3 items-end">
        <Button variant="primary">Add ways to earn</Button>
      </div>
      <div className=" w-full flex items-end justify-end">
        <Card className="w-full">
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
                    <AvatarImage src="/placeholder-user.jpg" alt="Event" />
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
                    <AvatarImage src="/placeholder-user.jpg" alt="Event" />
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
    </div>
  );
};

export default EventsTable;
