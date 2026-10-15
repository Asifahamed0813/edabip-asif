
const STORAGE_KEY = "edabip-integration-states";

export function saveIntegrationStates(integrations) {
  try {
    const states = integrations.map((integration) => ({
      name: integration.name,
      active: integration.active
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch (error) {
    console.error("Unable to save integration states:", error);
  }
}

export function loadIntegrationStates(integrations) {
  try {
    const savedStates = localStorage.getItem(STORAGE_KEY);

    if (!savedStates) {
      return integrations;
    }

    const states = JSON.parse(savedStates);

    return integrations.map((integration) => {
      const savedIntegration = states.find(
        (item) => item.name === integration.name
      );

      if (!savedIntegration) {
        return integration;
      }

      return {
        ...integration,
        active: savedIntegration.active
      };
    });
  } catch (error) {
    console.error("Unable to load integration states:", error);
    return integrations;
  }
}
