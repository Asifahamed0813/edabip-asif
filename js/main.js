import { loadDashboardData } from "./data.js";
import { showStatus, renderIntegrations } from "./render.js";
import { setupIntegrationEvents } from "./events.js";
import { setupRoles } from "./roles.js";
import { setupSettingsForms } from "./settings.js";

function setupThemeToggle() {
  const themeToggle = document.querySelector("#themeToggle");
  if (!themeToggle) return;

  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("edabip-theme") || "light";
  } catch (error) {
    console.error("Unable to read theme preference:", error);
  }

  document.documentElement.dataset.theme = savedTheme;
  document.body.classList.toggle("dark", savedTheme === "dark");

  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    document.body.classList.toggle("dark", nextTheme === "dark");

    try {
      localStorage.setItem("edabip-theme", nextTheme);
    } catch (error) {
      console.error("Unable to save theme preference:", error);
    }
  });
}

async function startApp() {
  const status = document.querySelector("#dataStatus");

  if (status) {
    status.textContent = "Loading settings...";
    status.hidden = false;
  }

  setupThemeToggle();
  setupSettingsForms();

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
