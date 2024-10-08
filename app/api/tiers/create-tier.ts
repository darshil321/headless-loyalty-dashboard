import { post } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const createTierAPI = async (tierData: any) => {
  try {
    const apiCall = await post(`/loyalty_tiers`, tierData);

    const response = apiCall.data;

    logger.info("createTierAPI", "createTierAPI", response);
    return response;
  } catch (e: any) {
    logger.error("createTierAPI", "createTierAPI", e);
    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "createTierAPI",
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
