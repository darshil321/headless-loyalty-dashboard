import { _delete } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const deleteTierAPI = async (tierId: string) => {
  try {
    const apiCall = await _delete(`/loyalty_tiers/${tierId}`);
    const response = apiCall.data;
    logger.info("deleteTierAPI", "Successfully delete tier", response);
    return response;
  } catch (e: any) {
    logger.error("deleteTierAPI", "Failed to delete tier", e);
    const errorResponse = e.response
      ? e.response.data
      : { message: "Unknown error" };
    throw new Error(errorResponse.message);
  }
};
