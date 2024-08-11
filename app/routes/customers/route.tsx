import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllLoyaltyUsers } from "@/store/user/userSlice";
import { useNavigate } from "@remix-run/react";
import { Button, Card, DataTable, Layout, Page } from "@shopify/polaris";
import { useEffect } from "react";
import { ViewIcon } from "@shopify/polaris-icons";

export default function CustomersTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.user.loyaltyUsers);

  const handleDetail = (id: string) => {
    navigate(`/tiers/${id}`);
  };
  const rows = users?.map((user: any, index) => [
    user.userId,
    user.totalPoints,
    user.tierId,
    <div className="flex space-x-2" key={index}>
      <Button onClick={() => handleDetail(user.id)} icon={ViewIcon} external />
    </div>,
  ]);

  useEffect(() => {
    // Ensure sessionStorage is accessed only client-side
    if (typeof window !== "undefined") {
      const storedConfig = JSON.parse(
        sessionStorage.getItem("app-bridge-config") || "{}",
      );
      const { host } = storedConfig;
      setupAxiosInterceptors(host);
      dispatch(getAllLoyaltyUsers());
    }
  }, []);
  return (
    <Page title="Customers">
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "text"]}
              headings={["User Id", "Points", "Tier"]}
              rows={rows}
              showTotalsInFooter={true}
              sortable={[false, false, true]}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
