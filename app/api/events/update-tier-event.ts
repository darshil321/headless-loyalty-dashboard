import { put } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const updateTierEventAPI = async (
  eventId: string,
  tierEventData: any,
) => {
  try {
    const apiCall = await put(`/loyalty_tier_events/${eventId}`, tierEventData);
    const response = apiCall.data;
    logger.info(
      "updateTierEventAPI",
      "Successfully updated tier event",
      response,
    );
    return response;
  } catch (e: any) {
    logger.error("updateTierEventAPI", "Failed to update tier event", e);
    const errorResponse = e.response
      ? e.response.data
      : { message: "Unknown error" };
    throw new Error(errorResponse.message);
  }
};
