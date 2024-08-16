import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const getTierEventAPI = async (eventId: string) => {
  try {
    const apiCall = await get(`/loyalty_tier_events/${eventId}`);
    console.log("here");
    const response = apiCall.data;

    logger.info("getTierEventAPI", "getTierEventAPI", response);
    return response;
  } catch (e: any) {
    logger.error("getTierEventAPI", "getTierEventAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "getTierEventAPI",
          "Failed to parse error response",
          parseError,
        );
      }
    } else {
      errorMessage = e.message || errorMessage;
    }

    const err = new Error(errorMessage);
    throw err;
  }
};
