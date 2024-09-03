import { put } from "@/lib/axios-api-instance";
import { TierFormData } from "@/lib/constants/constants";
import { logger } from "@/lib/logger";

export const updateConfigAPI = async (
  tierId: string,
  configData: TierFormData,
) => {
  try {
    const apiCall = await put(`/loyalty_config/${tierId}`, configData);
    const response = apiCall.data;
    logger.info("updateTierAPI", "Successfully updated Config", response);
    return response;
  } catch (e: any) {
    logger.error("updateConfigAPI", "Failed to update tier", e);
    const errorResponse = e.response
      ? e.response.data
      : { message: "Unknown error" };
    throw new Error(errorResponse.message);
  }
};
