import { setupSettingsForms } from "./settings.js";

// Initialize settings independently so a dashboard module error cannot disable form persistence.
setupSettingsForms();
