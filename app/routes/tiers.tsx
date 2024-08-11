import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Page, Card, Button, DataTable } from "@shopify/polaris";
import { listTiersAPI } from "@/api/tiers/list-tiers";

export const loader: LoaderFunction = async () => {
  const tiers = await listTiersAPI();
  return json({ tiers });
};

export default function TiersIndex() {
  const { tiers } = useLoaderData<typeof loader>();

  const rows = tiers.map((tier: any) => [
    tier.name,
    tier.status,
    tier.description,
    <Link key={tier.id} to={`/tiers/${tier.id}`}>
      Edit
    </Link>,
  ]);

  return (
    <Page title="Tiers">
      <Card>
        <Button url="/tiers/new">Create New Tier</Button>
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={["Name", "Status", "Description", "Actions"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
}
