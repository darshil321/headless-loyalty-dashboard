import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const listTransactionsAPI = async () => {
  try {
    const apiCall = await get(`/transaction`);

    logger.info(
      "listTransactionsAPI before",
      "listTransactionsAPI before",
      apiCall,
    );

    const response = apiCall.data;

    logger.info("listTransactionsAPI", "listTransactionsAPI", response);
    return response;
  } catch (e: any) {
    logger.error("listTransactionsAPI", "listTransactionsAPI", e);

    let errorMessage = "An unknown error occurred";

    if (e && e._response) {
      try {
        const errorResponse = JSON.parse(e._response);
        errorMessage = errorResponse.error || errorMessage;
      } catch (parseError) {
        logger.error(
          "listTransactionsAPI",
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
