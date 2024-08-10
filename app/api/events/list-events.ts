import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const listEventsAPI = async () => {
  try {
    const apiCall = await get(`/loyalty_tier_events`);

    const response = apiCall.data;

    logger.info("listEventsAPI", "listEventsAPI", response);
    return response;
  } catch (e) {
    logger.error("listEventsAPI", "listEventsAPI", e);

    const { _response: errorResponse } = e as any;
    const err = new Error(JSON.parse(errorResponse.body).error);
    throw err;
  }
};
