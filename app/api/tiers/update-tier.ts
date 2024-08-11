import { put } from "@/lib/axios-api-instance";
import { TierFormData } from "@/lib/constants/constants";
import { logger } from "@/lib/logger";

export const updateTierAPI = async (tierId: string, tierData: TierFormData) => {
  try {
    const apiCall = await put(`/loyalty_tiers/${tierId}`, tierData);
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
