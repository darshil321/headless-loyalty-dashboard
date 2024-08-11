import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const listTiersAPI = async () => {
  try {
    const apiCall = await get(`/loyalty_tiers`);

    logger.info("listTiersAPI before", "listTiersAPI before", apiCall);

    const response = apiCall.data;

    logger.info("listTiersAPI", "listTiersAPI", response);
    return response;
  } catch (e: any) {
    logger.error("listTiersAPI", "listTiersAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "listTiersAPI",
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
