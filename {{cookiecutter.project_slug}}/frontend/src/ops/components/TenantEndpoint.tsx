import { ExternalLink } from "lucide-react";

export function TenantEndpoint({ url }: { url?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-amber-500 hover:underline font-medium text-xs break-all"
    >
      {url}
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
    </a>
  );
}
