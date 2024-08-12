import { _delete } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const deleteTierEventAPI = async (eventId: string) => {
  try {
    const apiCall = await _delete(`/loyalty_tier_events/${eventId}`);
    const response = apiCall.data;
    logger.info(
      "deleteTierEventAPI",
      "Successfully delete tier event",
      response,
    );
    return response;
  } catch (e: any) {
    logger.error("deleteTierEventAPI", "Failed to delete tier event", e);
    const errorResponse = e.response
      ? e.response.data
      : { message: "Unknown error" };
    throw new Error(errorResponse.message);
  }
};
