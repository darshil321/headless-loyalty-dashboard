import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const getCustomerAPI = async (customerId: string) => {
  try {
    console.log("here customerid", customerId);
    const apiCall = await get(`/loyalty_wallet/${customerId}`);
    console.log("here");
    const response = apiCall.data;

    logger.info("getCustomerAPI", "getCustomerAPI", response);
    return response;
  } catch (e: any) {
    logger.error("getCustomerAPI", "getCustomerAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "getCustomerAPI",
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
