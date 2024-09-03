import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const getConfigAPI = async (tierId: string) => {
  try {
    const apiCall = await get(`/loyalty_config/${tierId}`);
    const response = apiCall.data;

    logger.info("getConfigAPI", "getConfigAPI", response);
    return response;
  } catch (e: any) {
    logger.error("getConfigAPI", "getConfigAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "getConfigAPI",
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
