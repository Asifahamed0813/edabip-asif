// EDABIP demo data and interactions. Data is stored in this browser session only.
const integrations = [
  { name: "Salesforce CRM", active: true },
  { name: "Google Analytics", active: false },
  { name: "Stack", active: true },
  { name: "Microsoft Teams", active: true },
  { name: "Microsoft Teams", active: true }
];

const roles = [
  { name: "Admin", users: 5, description: "Full access to all features setting", permissions: ["Users", "Settings", "Reports", "Billing"] },
  { name: "Business Analyst", users: 18, description: "Access to analytics, reports and dashboards", permissions: ["Analytics", "Reports", "Dashboards"] },
  { name: "Editor", users: 32, description: "Can edit reports and dashboards", permissions: ["Reports", "Dashboards"] },
  { name: "Viewer", users: 120, description: "View only access to reports and dashboards", permissions: ["View reports", "View dashboards"] }
];

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderIntegrations() {
  $("#integrationsRows").innerHTML = integrations.map((item, index) => `
    <tr>
      <td>${item.name}</td>
      <td><span class="status ${item.active ? "" : "inactive"}">${item.active ? "Active" : "Inactive"}</span></td>
      <td><button class="small-action" type="button" data-integration="${index}">${item.active ? "Disconnect" : "Connect"}</button></td>
    </tr>`).join("");
}

let currentTab = "overview";
let currentPage = 1;
const pageSize = 4;

function renderRoles() {
  const head = $("#rolesHead");
  const rows = $("#rolesRows");
  if (currentTab === "overview") {
    head.innerHTML = "<tr><th>Role Name</th><th>Users</th><th>Description</th><th>Action</th></tr>";
    const start = (currentPage - 1) * pageSize;
    const pageRoles = roles.slice(start, start + pageSize);
    rows.innerHTML = pageRoles.map(role => `<tr><td>${role.name}</td><td>${role.users}</td><td>${role.description}</td><td><button class="role-action" type="button" aria-label="More actions for ${role.name}" data-role="${role.name}">⋮</button></td></tr>`).join("");
    $("#pageInfo").textContent = `Showing ${roles.length ? start + 1 : 0} to ${Math.min(start + pageSize, roles.length)} of ${roles.length} roles`;
    renderPagination();
  } else {
    head.innerHTML = "<tr><th>Role</th><th>Analytics</th><th>Reports</th><th>Users</th><th>Settings</th></tr>";
    rows.innerHTML = roles.map(role => `<tr><td>${role.name}</td>${["Analytics", "Reports", "Users", "Settings"].map(permission => `<td>${role.permissions.includes(permission) ? "✓" : "—"}</td>`).join("")}</tr>`).join("");
    $("#pageInfo").textContent = "Permission access by role";
    $("#pagination").innerHTML = "";
  }
}

function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(roles.length / pageSize));
  const pagination = $("#pagination");
  pagination.innerHTML = `<button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>‹ Back</button>` +
    Array.from({ length: totalPages }, (_, i) => `<button type="button" class="${currentPage === i + 1 ? "active" : ""}" data-page="${i + 1}" aria-label="Page ${i + 1}" ${currentPage === i + 1 ? 'aria-current="page"' : ""}>${i + 1}</button>`).join("") +
    `<button type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>Next ›</button>`;
}

renderIntegrations();
renderRoles();

// Expand/collapse settings sections.
$$("[data-collapse]").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.collapse);
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    target.classList.toggle("is-collapsed", expanded);
  });
});

// Native browser validation is enabled. Save messages are demo-only.
$("#generalForm").addEventListener("submit", event => {
  event.preventDefault();
  $("#generalMessage").textContent = "General settings saved in this demo.";
  showToast("General settings saved.");
});
$("#notificationForm").addEventListener("submit", event => {
  event.preventDefault();
  $("#notificationMessage").textContent = "Notification preferences updated in this demo.";
  showToast("Notification preferences updated.");
});
$("#securityForm").addEventListener("submit", event => {
  event.preventDefault();
  const password = $("#passwordInput").value;
  if (password.length < 8) {
    $("#securityMessage").textContent = "Use at least 8 characters for the password.";
    $("#passwordInput").focus();
    return;
  }
  $("#securityMessage").textContent = "Security settings saved in this demo.";
  showToast("Security settings saved.");
});

$("#showPassword").addEventListener("click", () => {
  const input = $("#passwordInput");
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  $("#showPassword").textContent = show ? "Hide" : "Show";
  $("#showPassword").setAttribute("aria-pressed", String(show));
});

$("#integrationsRows").addEventListener("click", event => {
  const button = event.target.closest("[data-integration]");
  if (!button) return;
  const item = integrations[Number(button.dataset.integration)];
  item.active = !item.active;
  renderIntegrations();
  $("#integrationMessage").textContent = `${item.name} is now ${item.active ? "connected" : "disconnected"} (demo only).`;
});
$("#pagination").addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  const next = Number(button.dataset.page);
  if (next >= 1 && next <= Math.ceil(roles.length / pageSize)) {
    currentPage = next;
    renderRoles();
  }
});
$$("[data-tab]").forEach(button => button.addEventListener("click", () => {
  currentTab = button.dataset.tab;
  currentPage = 1;
  $$("[data-tab]").forEach(tab => {
    const active = tab === button;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  renderRoles();
}));
$("#rolesRows").addEventListener("click", event => {
  const button = event.target.closest("[data-role]");
  if (button) showToast(`Role selected: ${button.dataset.role}. Role editing is a demo action.`);
});

// Search filters the dashboard cards and settings sections.
const searchInput = $("#globalSearch");
function filterSections() {
  const query = searchInput.value.trim().toLowerCase();
  $$(".searchable").forEach(section => {
    const searchableText = `${section.dataset.search || ""} ${section.textContent}`.toLowerCase();
    section.classList.toggle("search-hidden", query.length > 0 && !searchableText.includes(query));
  });
  if (query) showToast(`Searching settings for “${query}”`);
}
searchInput.addEventListener("input", filterSections);
$("#clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  filterSections();
  searchInput.focus();
});

// Sidebar controls and sample actions.
$("#sidebarToggle").addEventListener("click", () => $("#sidebar").classList.toggle("is-collapsed"));
$("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("mobile-open"));
$("#askAi").addEventListener("click", () => showToast("AI Assistant demo: connect an AI service later."));
$("#floatingAi").addEventListener("click", () => showToast("AI Assistant demo: connect an AI service later."));
$("#notificationsBtn").addEventListener("click", () => showToast("You’re all caught up."));
$("#profileBtn").addEventListener("click", () => showToast("Signed in as Alin (sample profile)."));

// Update the visible ON/OFF label for all switches.
$$(".switch input").forEach(input => {
  const updateSwitch = () => {
    const label = input.closest(".switch");
    label.querySelector(".switch-state").textContent = input.checked ? "ON" : "OFF";
    label.style.background = input.checked ? "var(--teal-800)" : "#8a9097";
  };
  input.addEventListener("change", updateSwitch);
  updateSwitch();
});
