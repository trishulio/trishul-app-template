export interface HealthDiskDetails {
  total: number;
  free: number;
  threshold: number;
}

export interface HealthResponse {
  status: string;
  components?: {
    db?: {
      status: string;
      details?: { database?: string; validationQuery?: string };
    };
    diskSpace?: { status: string; details?: HealthDiskDetails };
    ping?: { status: string };
  };
}
