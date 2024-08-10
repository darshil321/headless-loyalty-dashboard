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
  } catch (e) {
    logger.error("getTierAPI", "getTierAPI", e);

    const { _response: errorResponse } = e as any;
    const err = new Error(JSON.parse(errorResponse.body).error);
    throw err;
  }
};
