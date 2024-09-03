import { Page, Card, Button, Icon } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";

import {
  EditIcon,
  CartDiscountIcon,
  SettingsIcon,
  ArrowUpIcon,
} from "@shopify/polaris-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { setupAxiosInterceptors } from "@/lib/axios-api-instance";
import { getAllLoyaltyConfigs } from "@/store/config/configSlice";

const configKeyMap: any = {
  COUPON: "Coupon",
  EVENT_MATCH: "Event Matching",
  TIER_UPDATE: "Tier Updation",
};

const configIconMap: any = {
  COUPON: CartDiscountIcon,
  EVENT_MATCH: SettingsIcon,
  TIER_UPDATE: ArrowUpIcon,
};

export default function CustomerDetails() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const configs = useAppSelector((state) => state.config.loyaltyConfigs);
  const loading = useAppSelector((state) => state.config.loading);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const handleEditClick = (id: string) => {
    navigate("/settings/" + id);
  };

  useEffect(() => {
    if (!isDataFetched) {
      if (typeof window !== "undefined") {
        const storedConfig = JSON.parse(
          sessionStorage.getItem("app-bridge-config") || "{}",
        );
        const { host } = storedConfig;

        if (host) {
          setupAxiosInterceptors(host);
          setIsDataFetched(true);
        }
        dispatch(getAllLoyaltyConfigs());
      }
    }
  }, [dispatch, isDataFetched]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const _configs = configs.map((config: any, index) => {
    return (
      <div className="mb-2" key={index}>
        <Card>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <div>
                <Icon source={configIconMap[config.key]} />
              </div>
              <div>{configKeyMap[config.key]}</div>
            </div>
            <div>
              <Button
                icon={EditIcon}
                external
                onClick={() => handleEditClick(config.id)}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  });

  return <Page title="Settings">{_configs}</Page>;
}
