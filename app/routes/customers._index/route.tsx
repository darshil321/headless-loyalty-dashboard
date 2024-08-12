import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllLoyaltyUsers } from "@/store/user/userSlice";
import { useNavigate } from "@remix-run/react";
import {
  Button,
  LegacyCard,
  IndexTable,
  Text,
  useIndexResourceState,
  useBreakpoints,
  Page,
  Layout,
} from "@shopify/polaris";
import { useEffect } from "react";
import { ViewIcon } from "@shopify/polaris-icons";

export default function CustomersTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.user.loyaltyUsers);

  const handleDetail = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(users || []);

  const rowMarkup = users?.map((user, index) => (
    <IndexTable.Row
      id={user.id}
      key={user.id}
      selected={selectedResources.includes(user.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {user?.userId}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{user.totalPoints}</IndexTable.Cell>
      <IndexTable.Cell>{user.tierId}</IndexTable.Cell>
      <IndexTable.Cell>
        <Button
          onClick={() => handleDetail(user.id)}
          icon={ViewIcon}
          external
        />
      </IndexTable.Cell>
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
          <LegacyCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Customers</h2>
            </div>
            {(!users || !rowMarkup) && <div>Loading...</div>}
            {users && rowMarkup && users.length === 0 && (
              <div>No customers found</div>
            )}
            {users && rowMarkup && (
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
                  { title: "Actions" },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            )}
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
