import Axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { getTenantId } from "@/lib/tenantStorage";

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

export const AXIOS_INSTANCE = Axios.create({ headers });

// add a request interceptor
AXIOS_INSTANCE.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get the current auth session and add tokens to requests
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();
      const idToken = session.tokens?.idToken?.toString();

      // Send access token as Bearer token in Authorization header
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Send ID token as X-Iaas-Token header
      if (idToken) {
        config.headers["X-Iaas-Token"] = idToken;
      }

      // Attach the active tenant ID from storage (set at login from Cognito groups).
      // Temporary approach until the tenant-selection UI is implemented.
      const tenantId = getTenantId();
      if (tenantId) {
        config.headers["X-TENANT-ID"] = tenantId;
      }
    } catch (error) {
      // If not authenticated, proceed without tokens
      console.warn("No auth session available:", error);
    }

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
