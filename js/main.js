
import { loadDashboardData } from "./data.js";
import {
  showStatus,
  renderIntegrations
} from "./render.js";
import { setupIntegrationEvents } from "./events.js";
import { setupRoles } from "./roles.js";

async function startApp() {
  const status = document.querySelector("#dataStatus");

  if (status) {
    status.textContent = "Loading settings...";
    status.hidden = false;
  }

  try {
    const data = await loadDashboardData();

    renderIntegrations(data.integrations);
    setupIntegrationEvents(data.integrations);

    setupRoles(data.roles);

    showStatus("Settings data loaded successfully.", "success");
  } catch (error) {
    console.error("Could not load dashboard data:", error);

    showStatus(
      "Unable to load settings. Please refresh and try again.",
      "error"
    );
  }
}

startApp();

/* Theme toggle */
function setupThemeToggle() {
  const themeToggle = document.querySelector("#themeToggle");

  if (!themeToggle) return;

  const savedTheme = localStorage.getItem("edabip-theme") || "light";

  document.documentElement.dataset.theme = savedTheme;

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("edabip-theme", newTheme);
  });
}

setupThemeToggle();
