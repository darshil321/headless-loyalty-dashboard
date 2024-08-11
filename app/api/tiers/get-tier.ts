import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const getTierAPI = async (tierId: string) => {
  try {
    console.log("here tierid", tierId);
    const apiCall = await get(`/loyalty_tier/${tierId}`);
    console.log("here");
    const response = apiCall.data;

    logger.info("getTierAPI", "getTierAPI", response);
    return response;
  } catch (e: any) {
    logger.error("getTierAPI", "getTierAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "getTierAPI",
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
