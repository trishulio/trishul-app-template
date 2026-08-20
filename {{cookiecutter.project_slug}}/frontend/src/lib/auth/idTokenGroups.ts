interface GroupsPayload {
  "cognito:groups"?: unknown;
}

export function extractGroupsFromIdToken(idToken: string): string[] {
  const segment = idToken.split(".")[1];
  if (!segment) return [];

  try {
    const decoded = atob(segment.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(decoded) as GroupsPayload;
    const groups = payload["cognito:groups"];
    return Array.isArray(groups) ? groups.map(String) : [];
  } catch {
    return [];
  }
}
