import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { getTierAPI } from "@/api/tiers/get-tier";
import { updateTierAPI } from "@/api/tiers/update-tier";
import { formSchema } from "@/lib/constants/constants";
import TierForm from "@/components/tiers/tier-form";

export const loader: LoaderFunction = async ({ params }) => {
  const tierData = await getTierAPI(params?.tierId as string);
  return json({ tierData });
};

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "active" | "inactive",
      rules: formData.getAll("rules") as string[],
    };

    const validatedData = formSchema.parse(data);
    await updateTierAPI(params.id ? params.id : "", validatedData);

    return redirect(`/tiers/${params.id}`);
  } catch (error: any) {
    return json(
      { error: error.message || "An error occurred" },
      { status: 400 },
    );
  }
};

export default function EditTier() {
  const { tierData } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return <TierForm tierData={tierData} actionData={actionData} />;
}
