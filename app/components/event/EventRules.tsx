import React from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

const EventRules = () => {
  return (
    <div id="define-rule" className="pt-4">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Define Rules</h2>
          <p className="text-muted-foreground">
            Create new rules for your rewards program.
          </p>
        </div>
        <Card className="p-4">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="operations">Operations</Label>
              <Input id="operations" placeholder="Enter operations" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="field1">Field 1</Label>
                <Select>
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
                <Select>
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
                <Select>
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
              <Button variant="primary" type="submit">
                Save Rule
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EventRules;
