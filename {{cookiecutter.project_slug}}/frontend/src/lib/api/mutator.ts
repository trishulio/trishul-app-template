import Axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export const AXIOS_INSTANCE = Axios.create({
  headers: {
    "Content-Type": "application/json",
    "X-TENANT-ID": import.meta.env.VITE_TENANT_ID,
  },
});

// add a request interceptor
AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
);

// add a response interceptor
AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: unknown) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export type ErrorType<Error> = AxiosRequestConfig<Error>;
export type BodyType<BodyData> = BodyData;
