import { useEffect, useState } from "react";
import { Form } from "@remix-run/react";
// import {
//   MultiSelector,
//   MultiSelectorTrigger,
//   MultiSelectorInput,
//   MultiSelectorContent,
//   MultiSelectorList,
//   MultiSelectorItem,
// } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { ruleOptions } from "@/lib/constants/constants";
import { Label } from "../ui/label";
import { ruleOptions } from "@/lib/constants/constants";

interface TierFormProps {
  tierData?: {
    id?: string;
    name: string;
    description: string;
    status: "active" | "inactive";
    rules: string[];
  };
  actionData?: { error?: string };
}

export default function TierForm({ tierData, actionData }: TierFormProps) {
  // const [selectedRules, setSelectedRules] = useState<string[]>(
  //   tierData?.rules || [],
  // );
  const [status, setStatus] = useState(tierData?.status || "inactive");

  useEffect(() => {
    if (actionData?.error) {
      console.log("tierData", tierData, actionData);
      console.error("Action Error:", actionData.error);
    }
  }, [actionData, tierData]);

  return (
    <Form method="post" className="space-y-4 mx-4">
      {tierData && <input type="hidden" name="tierId" value={tierData.id} />}

      {/*===================== Name ==============================*/}

      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          defaultValue={tierData?.name || ""}
          required
        />
      </div>

      {/*===================== Description ==============================*/}

      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          name="description"
          defaultValue={tierData?.description || ""}
        />
      </div>

      {/*===================== Rules ==============================*/}

      <div className="grid grid-cols-3 gap-4">
        {/* <div className="grid gap-2">
          <Label htmlFor="description">Field 1</Label>
          <Input id="description" placeholder="description" />
        </div> */}
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

      {/*===================== Status ==============================*/}

      <div>
        <label htmlFor="status">Status</label>
        <Select
          name="status"
          value={status}
          onValueChange={setStatus as any}
          defaultValue={tierData?.status || "inactive"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {/* Add a hidden input to ensure the status is correctly submitted */}
        <input type="hidden" name="status" value={status} />
      </div>

      {/*===================== Submit Button ==============================*/}

      <div className="w-full flex items-end justify-end">
        <Button type="submit">
          {tierData ? "Update Tier" : "Create Tier"}
        </Button>
      </div>

      {actionData?.error && <p>Error: {actionData.error}</p>}
    </Form>
  );
}

{
  /* <div>
        <label htmlFor="rules">Rules</label>
        <MultiSelector values={selectedRules} onValuesChange={setSelectedRules}>
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Select rules" />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {ruleOptions.map((option) => (
                <MultiSelectorItem key={option.value} value={option.value}>
                  {option.label}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
        {selectedRules.map((rule, index) => (
          <input key={index} type="hidden" name="rules" value={rule} />
        ))}
      </div> */
}
