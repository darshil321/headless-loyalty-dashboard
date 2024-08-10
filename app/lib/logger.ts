/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  info: (event: any, functionName: any, data: any) => {
    console.log("Info", event, functionName, JSON.stringify(data));
  },
  error: (event: any, functionName: any, data: any) => {
    console.log("Error", event, functionName, JSON.stringify(data));
  },
};
