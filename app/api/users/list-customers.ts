import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const listCustomersAPI = async () => {
  try {
    const apiCall = await get(`/loyalty_wallet`);

    logger.info("listCustomersAPI before", "listCustomersAPI before", apiCall);

    const response = apiCall.data;

    logger.info("listCustomersAPI", "listCustomersAPI", response);
    return response;
  } catch (e: any) {
    logger.error("listCustomersAPI", "listCustomersAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "listCustomersAPI",
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
