import { put, patch } from "@/lib/axios-api-instance";
import { logger } from "@/lib/logger";

export const updateCustomerAPI = async (
  customerId: string,
  customerData: any,
) => {
  try {
    const apiCall = await put(`/loyalty_wallet/${customerId}`, customerData);
    const response = apiCall.data;
    logger.info("updateCustomerAPI", "Successfully updated customer", response);
    return response;
  } catch (e: any) {
    logger.error("updateCustomerAPI", "Failed to update customer", e);
    const errorResponse = e.response
      ? e.response.data
      : { message: "Unknown error" };
    throw new Error(errorResponse.message);
  }
};

export const patchCustomerAPI = async (
  customerId: string,
  customerData: any,
) => {
  try {
    const apiCall = await patch(
      `/loyalty_wallet/edit-tier/${customerId}`,
      customerData,
    );
    const response = apiCall.data;
    logger.info("updateCustomerAPI", "Successfully updated customer", response);
    return response;
  } catch (e: any) {
    logger.error("updateCustomerAPI", "Failed to update customer", e);
    const errorResponse = e.response
      ? e.response.data
      : { message: "Unknown error" };
    throw new Error(errorResponse.message);
  }
};
