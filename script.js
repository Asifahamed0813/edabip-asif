(() => {
  "use strict";

  const SELECTOR = {
    integrationCards: "#integrationCards",
    connectedCount: "#connectedCount",
    integrationCountLabel: "#integrationCountLabel",
    rolesHead: "#rolesHead",
    rolesRows: "#rolesRows",
    pageInfo: "#pageInfo",
    pagination: "#pagination",
    toast: "#toast",
    globalSearch: "#globalSearch",
    clearSearch: "#clearSearch",
    themeToggle: "#themeToggle",
    sidebar: "#sidebar"
  };

  const integrations = [
    { name: "Salesforce CRM", icon: "S", active: true, sync: "8 min ago", description: "CRM & customer management" },
    { name: "Google Analytics", icon: "G", active: true, sync: "2 min ago", description: "Website analytics" },
    { name: "Slack", icon: "#", active: false, sync: "Not connected", description: "Team communication" },
    { name: "Microsoft Teams", icon: "T", active: true, sync: "12 min ago", description: "Meetings & collaboration" },
    { name: "Stack", icon: "⌁", active: true, sync: "5 min ago", description: "Workspace automation" }
  ];

  const roles = [
    { name: "Admin", users: 5, description: "Full access to workspace settings", permissions: ["Analytics", "Reports", "Users", "Settings"] },
    { name: "Business Analyst", users: 18, description: "Analytics, reports and dashboards", permissions: ["Analytics", "Reports"] },
    { name: "Editor", users: 32, description: "Edit reports and dashboards", permissions: ["Reports"] },
    { name: "Viewer", users: 120, description: "View reports and dashboards", permissions: ["Analytics", "Reports"] }
  ];

  const query = (selector, parent = document) => parent.querySelector(selector);
  const queryAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  let toastTimeout;
  let activeRoleTab = "overview";

  function showToast(message) {
    const toast = query(SELECTOR.toast);
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function setMessage(element, message) {
    if (element) element.textContent = message;
  }

  function updateSwitch(input) {
    const state = query(".switch-state", input.closest(".switch"));
    if (state) state.textContent = input.checked ? "ON" : "OFF";
  }

  function initializeSwitches() {
    queryAll(".switch input").forEach((input) => {
      updateSwitch(input);
      input.addEventListener("change", () => {
        updateSwitch(input);
        const label = input.name.replace(/([A-Z])/g, " $1").toLowerCase();
        showToast(`${label} ${input.checked ? "enabled" : "disabled"}.`);
      });
    });
  }

  function renderIntegrations() {
    const container = query(SELECTOR.integrationCards);
    if (!container) return;

    const connectedCount = integrations.filter((integration) => integration.active).length;
    query(SELECTOR.connectedCount).textContent = String(connectedCount);
    query(SELECTOR.integrationCountLabel).textContent =
      `${connectedCount} connected`;

    container.innerHTML = integrations.map((integration, index) => `
      <article class="integration-card">
        <div class="integration-top">
          <span class="service-logo" aria-hidden="true">${integration.icon}</span>
          <div>
            <strong>${integration.name}</strong>
            <small>${integration.description}</small>
          </div>
          <span class="service-status ${integration.active ? "" : "off"}">
            ${integration.active ? "Connected" : "Available"}
          </span>
        </div>
        <div class="integration-bottom">
          <span>${integration.active ? `Last synced ${integration.sync}` : "Ready to connect"}</span>
          <button class="small-action" type="button" data-integration="${index}"
            aria-label="${integration.active ? "Disconnect" : "Connect"} ${integration.name}">
            ${integration.active ? "Disconnect" : "Connect"}
          </button>
        </div>
      </article>
    `).join("");
  }

  function handleIntegrationClick(event) {
    const button = event.target.closest("[data-integration]");
    if (!button) return;

    const integration = integrations[Number(button.dataset.integration)];
    if (!integration) return;

    integration.active = !integration.active;
    showToast(`${integration.name} ${integration.active ? "connected" : "disconnected"} successfully.`);
    renderIntegrations();
  }

  function renderRoles() {
    const head = query(SELECTOR.rolesHead);
    const rows = query(SELECTOR.rolesRows);
    const pageInfo = query(SELECTOR.pageInfo);
    const pagination = query(SELECTOR.pagination);
    if (!head || !rows || !pageInfo || !pagination) return;

    if (activeRoleTab === "overview") {
      head.innerHTML = `
        <tr>
          <th scope="col">Role</th>
          <th scope="col">Users</th>
          <th scope="col">Description</th>
          <th scope="col">Action</th>
        </tr>`;
      rows.innerHTML = roles.map((role) => `
        <tr>
          <td><strong>${role.name}</strong></td>
          <td>${role.users}</td>
          <td>${role.description}</td>
          <td><button class="role-action" type="button" data-role="${role.name}"
            aria-label="View ${role.name} role options">•••</button></td>
        </tr>`).join("");
      pageInfo.textContent = `Showing all ${roles.length} roles`;
      pagination.replaceChildren();
      return;
    }

    const permissions = ["Analytics", "Reports", "Users", "Settings"];
    head.innerHTML = `
      <tr>
        <th scope="col">Role</th>
        ${permissions.map((permission) => `<th scope="col">${permission}</th>`).join("")}
      </tr>`;
    rows.innerHTML = roles.map((role) => `
      <tr>
        <td><strong>${role.name}</strong></td>
        ${permissions.map((permission) => `
          <td aria-label="${role.name}: ${permission} ${role.permissions.includes(permission) ? "allowed" : "not allowed"}">
            ${role.permissions.includes(permission) ? "✓" : "—"}
          </td>`).join("")}
      </tr>`).join("");
    pageInfo.textContent = "Permission access by role";
    pagination.replaceChildren();
  }

  function initializeRoleTabs() {
    queryAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeRoleTab = button.dataset.tab;
        queryAll("[data-tab]").forEach((tabButton) => {
          const isActive = tabButton === button;
          tabButton.classList.toggle("active", isActive);
          tabButton.setAttribute("aria-selected", String(isActive));
          tabButton.tabIndex = isActive ? 0 : -1;
        });
        const panel = query("#rolesPanel");
        if (panel) panel.setAttribute("aria-labelledby", button.id);
        renderRoles();
      });

      button.addEventListener("keydown", (event) => {
        const tabs = queryAll("[data-tab]");
        const currentIndex = tabs.indexOf(button);
        let nextIndex = currentIndex;
        if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      });
    });

    query(SELECTOR.rolesRows)?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-role]");
      if (button) showToast(`Role selected: ${button.dataset.role}. Editing is a demo action.`);
    });
  }

  function initializeSectionNavigation() {
    const sections = queryAll(".section-block");
    const links = queryAll(".settings-nav a[href^='#']");

    function activateLink(sectionId) {
      links.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("current", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activateLink(entry.target.id);
        });
      }, { rootMargin: "-25% 0px -65% 0px" });

      sections.forEach((section) => observer.observe(section));
    }

    links.forEach((link) => {
      link.addEventListener("click", () => {
        const targetId = link.getAttribute("href").slice(1);
        activateLink(targetId);
        query(SELECTOR.sidebar)?.classList.remove("mobile-open");
      });
    });
  }

  function initializeForm(formSelector, messageSelector, successMessage) {
    const form = query(formSelector);
    const message = query(messageSelector);
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        setMessage(message, "Please check the highlighted fields.");
        return;
      }

      setMessage(message, successMessage);
      showToast(successMessage);
    });
  }

  function initializeSecurityForm() {
    const form = query("#securityForm");
    const passwordInput = query("#passwordInput");
    const message = query("#securityMessage");
    const showPasswordButton = query("#showPassword");
    if (!form || !passwordInput || !showPasswordButton) return;

    showPasswordButton.addEventListener("click", () => {
      const shouldShowPassword = passwordInput.type === "password";
      passwordInput.type = shouldShowPassword ? "text" : "password";
      showPasswordButton.textContent = shouldShowPassword ? "Hide" : "Show";
      showPasswordButton.setAttribute("aria-pressed", String(shouldShowPassword));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const password = passwordInput.value;
      if (password && password.length < 8) {
        setMessage(message, "Use at least 8 characters for a new password.");
        passwordInput.focus();
        return;
      }

      setMessage(message, password ? "Password and security settings saved." : "Security settings saved.");
      showToast(password ? "Password and security settings saved." : "Security settings saved.");
      passwordInput.value = "";
      passwordInput.type = "password";
      showPasswordButton.textContent = "Show";
      showPasswordButton.setAttribute("aria-pressed", "false");
    });
  }

  function initializeSearch() {
    const searchInput = query(SELECTOR.globalSearch);
    const clearButton = query(SELECTOR.clearSearch);
    if (!searchInput || !clearButton) return;

    function filterSections() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      queryAll(".searchable").forEach((section) => {
        const searchableText = `${section.dataset.search || ""} ${section.textContent}`.toLowerCase();
        section.classList.toggle("search-hidden", Boolean(searchTerm) && !searchableText.includes(searchTerm));
      });
      clearButton.hidden = searchInput.value.length === 0;
    }

    searchInput.addEventListener("input", filterSections);
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      filterSections();
      searchInput.focus();
    });
    filterSections();
  }

  function initializeTheme() {
    const themeButton = query(SELECTOR.themeToggle);
    if (!themeButton) return;

    try {
      if (localStorage.getItem("edabip-theme") === "dark") {
        document.body.classList.add("dark");
      }
    } catch (error) {
      // Theme switching still works if browser storage is unavailable.
    }

    function syncThemeButton() {
      const isDark = document.body.classList.contains("dark");
      themeButton.textContent = isDark ? "☀" : "☾";
      themeButton.title = isDark ? "Switch to light theme" : "Switch to dark theme";
      themeButton.setAttribute("aria-pressed", String(isDark));
    }

    syncThemeButton();
    themeButton.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      try {
        localStorage.setItem("edabip-theme", isDark ? "dark" : "light");
      } catch (error) {
        // The selected theme remains active until the page is refreshed.
      }
      syncThemeButton();
      showToast(`${isDark ? "Dark" : "Light"} theme enabled.`);
    });
  }

  function initializeUtilityButtons() {
    query("#sidebarToggle")?.addEventListener("click", () => {
      const sidebar = query(SELECTOR.sidebar);
      if (!sidebar) return;
      const isCollapsed = sidebar.classList.toggle("is-collapsed");
      query("#sidebarToggle").setAttribute("aria-expanded", String(!isCollapsed));
    });

    query("#mobileMenu")?.addEventListener("click", () => {
      const sidebar = query(SELECTOR.sidebar);
      if (!sidebar) return;
      const isOpen = sidebar.classList.toggle("mobile-open");
      query("#mobileMenu").setAttribute("aria-expanded", String(isOpen));
    });

    query("#askAi")?.addEventListener("click", () => showToast("EDABIP AI is ready to assist."));
    query("#floatingAi")?.addEventListener("click", () => showToast("EDABIP AI is ready to assist."));
    query("#notificationsBtn")?.addEventListener("click", () => showToast("You are all caught up."));
    query("#profileBtn")?.addEventListener("click", () => showToast("Signed in as Alin."));
    query("#improveSecurity")?.addEventListener("click", () => {
      window.location.hash = "security";
      showToast("Security settings opened.");
    });
    query("#viewActivity")?.addEventListener("click", () => showToast("Showing recent workspace activity."));
  }

  function initializeDashboard() {
    initializeSwitches();
    renderIntegrations();
    query(SELECTOR.integrationCards)?.addEventListener("click", handleIntegrationClick);
    renderRoles();
    initializeRoleTabs();
    initializeSectionNavigation();
    initializeForm("#generalForm", "#generalMessage", "Profile saved successfully.");
    initializeForm("#notificationForm", "#notificationMessage", "Notification preferences updated.");
    initializeSecurityForm();
    initializeSearch();
    initializeTheme();
    initializeUtilityButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDashboard, { once: true });
  } else {
    initializeDashboard();
  }
})();
