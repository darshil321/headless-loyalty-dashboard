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

const EventBenefits = () => {
  return (
    <div id="define-rule" className="pt-4">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">Define Benefits</h2>
          <p className="text-muted-foreground">
            Create new Benefits for your rewards program.
          </p>
        </div>
        <Card className="p-4">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="operations">Types of Benefits</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="select Benefit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Field 1</Label>
                <Input id="description" placeholder="description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="field2">criteria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">value</Label>
                <Input id="value" placeholder="value" />
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

export default EventBenefits;
