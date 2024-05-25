import axios, { AxiosError, AxiosInstance } from "axios";

export const baseURL = "https://api-testnet.bscscan.com/api";

console.log("baseURL: ", baseURL);

export const instanceAxios: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

instanceAxios.interceptors.request.use((config) => {
  return config;
});

instanceAxios.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
