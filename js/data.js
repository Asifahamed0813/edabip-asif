
import { loadIntegrationStates } from "./storage.js";

export async function loadJson(filePath) {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Failed to load ${filePath}`);
  }

  return response.json();
}

export async function loadDashboardData() {
  const [integrations, roles] = await Promise.all([
    loadJson("./data/integrations.json"),
    loadJson("./data/roles.json")
  ]);

  const savedIntegrations = loadIntegrationStates(integrations);

  return {
    integrations: savedIntegrations,
    roles
  };
}
