
export function showStatus(message, type = "info") {
  const status = document.querySelector("#dataStatus");

  if (!status) return;

  status.textContent = message;
  status.dataset.state = type;
}

export function updateIntegrationCount(integrations) {
  const connectedCount = integrations.filter(
    (integration) => integration.active
  ).length;

  const countElement = document.querySelector("#connectedCount");
  const countLabel = document.querySelector("#integrationCountLabel");

  if (countElement) {
    countElement.textContent = connectedCount;
  }

  if (countLabel) {
    countLabel.textContent = `${connectedCount} connected`;
  }
}

export function renderIntegrations(integrations) {
  const container = document.querySelector("#integrationCards");

  if (!container) return;

  container.replaceChildren();

  if (!integrations || integrations.length === 0) {
    container.textContent = "No integrations available.";
    updateIntegrationCount([]);
    return;
  }

  integrations.forEach((integration) => {
    const item = document.createElement("div");
    item.className = "integration-card";

    const details = document.createElement("div");
    details.className = "integration-details";

    const name = document.createElement("strong");
    name.className = "integration-name";
    name.textContent = integration.name;

    const badge = document.createElement("span");
    badge.className = integration.active
      ? "integration-status connected"
      : "integration-status disconnected";

    badge.textContent = integration.active
      ? "Connected"
      : "Disconnected";

    details.append(name, badge);

    const button = document.createElement("button");
    button.type = "button";
    button.className = integration.active
      ? "integration-action disconnect-btn"
      : "integration-action connect-btn";

    button.dataset.integrationName = integration.name;
    button.textContent = integration.active ? "Disconnect" : "Connect";

    item.append(details, button);
    container.appendChild(item);
  });

  updateIntegrationCount(integrations);
}