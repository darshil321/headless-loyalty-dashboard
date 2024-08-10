import { get } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const listTiersAPI = async () => {
  try {
    const apiCall = await get(`/loyalty_tiers`);

    const response = apiCall.data;

    logger.info("listTiersAPI", "listTiersAPI", response);
    return response;
  } catch (e) {
    logger.error("listTiersAPI", "listTiersAPI", e);

    const { _response: errorResponse } = e as any;
    const err = new Error(JSON.parse(errorResponse.body).error);
    throw err;
  }
};
