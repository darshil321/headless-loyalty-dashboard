import { put } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";
import type { TierFormData } from "@/routes/tiers_.$tierId/constants";

export const updateTierAPI = async (tierId: string, tierData: TierFormData) => {
  try {
    const apiCall = await put(`/loyalty_tier/${tierId}`, tierData);
    const response = apiCall.data;
    logger.info("updateTierAPI", "Successfully updated tier", response);
    return response;
  } catch (e: any) {
    logger.error("updateTierAPI", "Failed to update tier", e);
    const errorResponse = e.response
      ? e.response.data
      : { message: "Unknown error" };
    throw new Error(errorResponse.message);
  }
};
