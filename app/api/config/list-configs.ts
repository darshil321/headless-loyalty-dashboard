import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const listConfigsAPI = async () => {
  try {
    const apiCall = await get(`/loyalty_config`);

    logger.info("listConfigsAPI before", "listConfigsAPI before", apiCall);

    const response = apiCall.data;

    logger.info("listConfigsAPI", "listConfigsAPI", response);
    return response;
  } catch (e: any) {
    logger.error("listConfigsAPI", "listConfigsAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "listConfigAPI",
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
