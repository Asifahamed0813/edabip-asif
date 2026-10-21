import type { Integration, Role } from "../types/models";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export function getIntegrations(): Promise<Integration[]> {
  return fetchJson<Integration[]>("/data/integrations.json");
}

export function getRoles(): Promise<Role[]> {
  return fetchJson<Role[]>("/data/roles.json");
}
