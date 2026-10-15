import {
  isValidEmail,
  isValidMobile,
  isValidPassword
} from "./validators.js";

const PROFILE_KEY = "edabip-profile-settings";
const NOTIFICATION_KEY = "edabip-notification-settings";
const SECURITY_KEY = "edabip-security-settings";

function readSettings(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return null;
  }
}

function saveSettings(key, settings) {
  try {
    localStorage.setItem(key, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    return false;
  }
}

function getFormValues(form) {
  const values = {};
  for (const element of form.elements) {
    if (!element.name || element.type === "password" || element.type === "submit") {
      continue;
    }
    values[element.name] = element.type === "checkbox"
      ? element.checked
      : element.value;
  }
  return values;
}

function applySavedValues(form, values) {
  if (!values) return;

  for (const element of form.elements) {
    if (!element.name || !(element.name in values)) continue;

    if (element.type === "checkbox") {
      element.checked = Boolean(values[element.name]);
      updateSwitchLabel(element);
    } else {
      element.value = values[element.name];
    }
  }
}

function updateSwitchLabel(input) {
  const state = input.closest(".switch")?.querySelector(".switch-state");
  if (state) state.textContent = input.checked ? "ON" : "OFF";
}

function setMessage(id, message, isError = false) {
  const element = document.querySelector(id);
  if (!element) return;

  element.textContent = message;
  element.dataset.state = isError ? "error" : "success";
}

function setupProfileForm() {
  const form = document.querySelector("#generalForm");
  if (!form) return;

  applySavedValues(form, readSettings(PROFILE_KEY));

  form.querySelectorAll('input[type="checkbox"]').forEach(updateSwitchLabel);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const values = getFormValues(form);
    if (!form.reportValidity()) return;

    if (!isValidEmail(values.email)) {
      setMessage("#generalMessage", "Enter a valid email address.", true);
      form.elements.email.focus();
      return;
    }

    if (values.mobile && !isValidMobile(values.mobile)) {
      setMessage("#generalMessage", "Enter a valid 10-digit Indian mobile number.", true);
      form.elements.mobile.focus();
      return;
    }

    const saved = saveSettings(PROFILE_KEY, values);
    setMessage(
      "#generalMessage",
      saved ? "Profile settings saved." : "Could not save settings. Check browser storage.",
      !saved
    );
  });
}

function setupNotificationForm() {
  const form = document.querySelector("#notificationForm");
  if (!form) return;

  applySavedValues(form, readSettings(NOTIFICATION_KEY));
  form.querySelectorAll('input[type="checkbox"]').forEach(updateSwitchLabel);

  form.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") updateSwitchLabel(event.target);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const saved = saveSettings(NOTIFICATION_KEY, getFormValues(form));
    setMessage(
      "#notificationMessage",
      saved ? "Notification preferences saved." : "Could not save preferences. Check browser storage.",
      !saved
    );
  });
}

function setupSecurityForm() {
  const form = document.querySelector("#securityForm");
  if (!form) return;

  const saved = readSettings(SECURITY_KEY);
  if (saved && typeof saved.twoFactor === "boolean") {
    form.elements.twoFactor.checked = saved.twoFactor;
  }
  updateSwitchLabel(form.elements.twoFactor);

  form.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") updateSwitchLabel(event.target);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const password = form.elements.passwordInput?.value ?? "";
    if (password && !isValidPassword(password)) {
      setMessage("#securityMessage", "Password must be at least 8 characters long.", true);
      form.elements.passwordInput.focus();
      return;
    }

    const didSave = saveSettings(SECURITY_KEY, {
      twoFactor: form.elements.twoFactor.checked
    });

    if (!didSave) {
      setMessage("#securityMessage", "Could not save security settings. Check browser storage.", true);
      return;
    }

    // Passwords are validated but deliberately never stored in localStorage.
    if (form.elements.passwordInput) {
      form.elements.passwordInput.value = "";
      form.elements.passwordInput.type = "password";
    }
    const showPasswordButton = document.querySelector("#showPassword");
    if (showPasswordButton) {
      showPasswordButton.textContent = "Show";
      showPasswordButton.setAttribute("aria-pressed", "false");
    }
    updateSwitchLabel(form.elements.twoFactor);
    setMessage(
      "#securityMessage",
      password
        ? "Security settings saved. Demo password was not stored."
        : "Security settings saved.",
      false
    );
  });
}

function setupPasswordVisibility() {
  const input = document.querySelector("#passwordInput");
  const button = document.querySelector("#showPassword");
  if (!input || !button) return;

  button.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "Hide" : "Show";
    button.setAttribute("aria-pressed", String(show));
  });
}

export function setupSettingsForms() {
  setupProfileForm();
  setupNotificationForm();
  setupSecurityForm();
  setupPasswordVisibility();
}
