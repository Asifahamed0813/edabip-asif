
import { renderIntegrations, showStatus } from "./render.js";
import { saveIntegrationStates } from "./storage.js";

export function setupIntegrationEvents(integrations) {
  const container = document.querySelector("#integrationCards");

  if (!container) return;

  if (container.dataset.eventsInitialized === "true") return;

  container.dataset.eventsInitialized = "true";

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-integration-name]");

    if (!button || !container.contains(button)) return;

    const integration = integrations.find(
      (item) => item.name === button.dataset.integrationName
    );

    if (!integration) return;

    integration.active = !integration.active;

    saveIntegrationStates(integrations);
    renderIntegrations(integrations);

    showStatus(
      `${integration.name} ${
        integration.active ? "connected" : "disconnected"
      } successfully.`,
      "success"
    );
  });
}
