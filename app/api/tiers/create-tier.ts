import { post } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";
import type { TierFormData } from "@/routes/tiers_.$tierId/constants";

export const createTierAPI = async (tierData: TierFormData) => {
  try {
    const apiCall = await post(`/loyalty_tier/`, { tierData });

    const response = apiCall.data;

    logger.info("createTierAPI", "createTierAPI", response);
    return response;
  } catch (e) {
    logger.error("createTierAPI", "createTierAPI", e);

    const { _response: errorResponse } = e as any;
    const err = new Error(JSON.parse(errorResponse.body).error);
    throw err;
  }
};
