import { Form, useLoaderData, useActionData } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
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
import { getTierAPI } from "@/api/tiers/get-tier";
import { updateTierAPI } from "@/api/tiers/update-tier";
import { createTierAPI } from "@/api/tiers/create-tier";
import type { TierFormData } from "@/lib/constants/constants";
import { formSchema, ruleOptions } from "@/lib/constants/constants";
import { useEffect, useState } from "react";

export const loader: LoaderFunction = async ({ params }) => {
  if (params.id) {
    const tierData = await getTierAPI(params.id);
    return json({ tierData });
  }
  return json({ tierData: null });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    if (!formData) {
      return json({ error: "Invalid request" }, { status: 400 });
    }

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "active" | "inactive",
      rules: formData.getAll("rules") as string[],
    };

    const validatedData = formSchema.parse(data) as TierFormData;
    const tierId = formData.get("tierId") as string | null;

    let result;
    if (tierId) {
      result = await updateTierAPI(tierId, validatedData);
    } else {
      result = await createTierAPI(validatedData);
    }

    return redirect(`/tiers/${result.id}`);
  } catch (error: any) {
    console.error("Form submission error:", error);
    return json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 400 },
    );
  }
};

export default function TierForm() {
  const { tierData } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selectedRules, setSelectedRules] = useState<string[]>(
    tierData?.rules || [],
  );
  const [status, setStatus] = useState(tierData?.status || "inactive");

  useEffect(() => {
    if (actionData?.error) {
      console.error("Action Error:", actionData.error);
    }
  }, [actionData]);

  return (
    <Form method="post">
      {tierData && <input type="hidden" name="tierId" value={tierData.id} />}

      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          defaultValue={tierData?.name || ""}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          name="description"
          defaultValue={tierData?.description || ""}
        />
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <Select
          name="status"
          value={status}
          onValueChange={setStatus}
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

      <div>
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
      </div>

      <Button type="submit">{tierData ? "Update Tier" : "Create Tier"}</Button>

      {actionData?.error && <p>Error: {actionData.error}</p>}
    </Form>
  );
}
