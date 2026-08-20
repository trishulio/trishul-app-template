import Axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { setupInterceptors } from "./interceptors";

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.VITE_BACKEND_URL || "",
  headers,
  paramsSerializer: {
    indexes: null,
  },
});

setupInterceptors(AXIOS_INSTANCE);

export const apiClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: AxiosResponse<T>) => data);

  // @ts-expect-error injected cancel support
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export type ErrorType<Error> = AxiosRequestConfig<Error>;
export type BodyType<BodyData> = BodyData;
