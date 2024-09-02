import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllLoyaltyUsers } from "@/store/user/userSlice";
import { useNavigate } from "@remix-run/react";
import {
  IndexTable,
  Text,
  useIndexResourceState,
  Page,
  Layout,
  useBreakpoints,
  Card,
} from "@shopify/polaris";
import { useEffect } from "react";

export default function CustomersTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.user.loyaltyUsers);
  const loading = useAppSelector((state) => state.user.loading);

  const handleDetail = (id: string, userId: string) => {
    navigate(`/customers/${id}?userId=${userId}`);
  };

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(users || []);

  const rowMarkup = users?.map((user: any, index) => (
    <IndexTable.Row
      id={user.id}
      key={user.id}
      selected={selectedResources.includes(user.id)}
      position={index}
    >
      <IndexTable.Cell>
        <div onClick={() => handleDetail(user.id, user.userId)}>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {user?.userId}
          </Text>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>{user.totalPoints}</IndexTable.Cell>
      <IndexTable.Cell>{user.tier.name}</IndexTable.Cell>
      {/* <IndexTable.Cell>
        <Button
          onClick={() => handleDetail(user.id, user.userId)}
          icon={ViewIcon}
          external
        />
      </IndexTable.Cell> */}
    </IndexTable.Row>
  ));

  useEffect(() => {
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
            <IndexTable
              condensed={useBreakpoints().smDown}
              resourceName={resourceName}
              itemCount={users.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "User Id" },
                { title: "Points" },
                { title: "Tier" },
              ]}
              loading={loading}
              pagination={{ hasPrevious: false, hasNext: false }}
            >
              {rowMarkup}
            </IndexTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
