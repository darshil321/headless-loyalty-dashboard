import { post } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const createEventAPI = async (eventData: any) => {
  try {
    const apiCall = await post(`/loyalty_tier_events`, eventData);

    const response = apiCall.data;

    logger.info("createEventAPI", "createEventAPI", response);
    return response;
  } catch (e: any) {
    logger.error("createEventAPI", "createEventAPI", e);
    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "createEventAPI",
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
