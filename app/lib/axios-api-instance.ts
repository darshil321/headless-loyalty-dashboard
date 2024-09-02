// import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge/utilities";
import type {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { getAppInstance } from "./appBridgeInstance";

console.log("cccc", import.meta.env.BACKEND_URL);
// Axios instance with base URL setup
let axiosAPIInstance: AxiosInstance = axios.create({
  baseURL: "https://ub8x9415tg.execute-api.us-east-2.amazonaws.com/v1",
  timeout: 10000,
});
// Function to get the session token
const fetchSessionTokens = async (host: any): Promise<string> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const shopify = useAppBridge();
  try {
    const app = getAppInstance(host);
    const token = await getSessionToken(app);
    console.log("token", token);

    console.log("Fetching session token");
    // const token = await shopify.idToken();
    console.log("New session token fetched", token);
    return token;
  } catch (error) {
    console.error("Failed to fetch session token", error);
    throw new Error("Failed to authenticate.");
  }
};

export const setupAxiosInterceptors = (host: any) => {
  axiosAPIInstance.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig,
    ): Promise<InternalAxiosRequestConfig> => {
      const token = await fetchSessionTokens(host);
      if (config.headers instanceof Headers) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

// Response interceptor to handle responses and errors
axiosAPIInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data) return response.data;
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Custom methods for common HTTP verbs
const request = (
  method: Method,
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return axiosAPIInstance.request({
    method,
    url,
    ...config,
  });
};

const get = (
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return request("get", url, config);
};

const post = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return request("post", url, { data, ...config });
};

const put = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return request("put", url, { data, ...config });
};

const _delete = (
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return request("delete", url, config);
};

export { get, post, put, _delete };
export default axiosAPIInstance;
