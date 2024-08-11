import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const getTransactionAPI = async (transactionId: string) => {
  try {
    console.log("here transactionId", transactionId);
    const apiCall = await get(`/transaction/${transactionId}`);
    const response = apiCall.data;

    logger.info("getTransactionAPI", "getTransactionAPI", response);
    return response;
  } catch (e: any) {
    logger.error("getTransactionAPI", "getTransactionAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "getTransactionAPI",
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
