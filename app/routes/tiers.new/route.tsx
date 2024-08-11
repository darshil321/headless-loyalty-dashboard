import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createTierAPI } from "@/api/tiers/create-tier";
import { formSchema } from "@/lib/constants/constants";
import TierForm from "@/components/tiers/tier-form";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "active" | "inactive",
      rules: formData.getAll("rules") as string[],
    };

    const validatedData = formSchema.parse(data);
    const result = await createTierAPI(validatedData);

    return redirect(`/tiers/${result.id}`);
  } catch (error: any) {
    return json(
      { error: error.message || "An error occurred" },
      { status: 400 },
    );
  }
};

export default function NewTier() {
  const actionData = useActionData<typeof action>();
  console.log("tierDataxxs", actionData);

  return <TierForm actionData={actionData} />;
}
