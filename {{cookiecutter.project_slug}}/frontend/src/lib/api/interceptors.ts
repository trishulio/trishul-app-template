import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { getTenantId } from "@/lib/auth/tenantStorage";

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();
        const idToken = session.tokens?.idToken?.toString();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (idToken) {
          config.headers["X-Iaas-Token"] = idToken;
        }

        const isOpsPortal =
          typeof window !== "undefined" &&
          window.location.hostname.startsWith("ops.");
        if (!isOpsPortal) {
          const tenantId = getTenantId();
          if (tenantId) {
            config.headers["X-TENANT-ID"] = tenantId;
          }
        }
      } catch (error) {
        console.warn("No auth session available:", error);
      }

      return config;
    },
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error);
      return Promise.reject(error);
    },
  );
}
