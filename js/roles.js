const STORAGE_KEY = "edabip-role-permissions";
const PAGE_SIZE = 3;

let rolesData = [];
let permissionCatalog = [];
let currentPage = 1;
let activeTab = "overview";
let pendingPermissions = {};
let rolesPanel;
let rolesHead;
let rolesRows;
let pageInfo;
let pagination;
let saveButton;
let changesMessage;

function loadSavedPermissions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Could not load role permissions:", error);
    return {};
  }
}

function getPermissions(role) {
  if (Object.hasOwn(pendingPermissions, role.name)) {
    return pendingPermissions[role.name];
  }
  return role.permissions;
}

function getAllPermissions() {
  // Keep every known permission visible, even when it is unchecked for all roles.
  return [...permissionCatalog].sort();
}

function createCell(text, tag = "td") {
  const cell = document.createElement(tag);
  cell.textContent = text;
  return cell;
}

function renderOverview() {
  rolesHead.replaceChildren();
  rolesRows.replaceChildren();

  const headerRow = document.createElement("tr");
  ["Role", "Users", "Description", "Permissions"].forEach((heading) => {
    headerRow.appendChild(createCell(heading, "th"));
  });
  rolesHead.appendChild(headerRow);

  const totalPages = Math.max(1, Math.ceil(rolesData.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRoles = rolesData.slice(start, start + PAGE_SIZE);

  if (pageRoles.length === 0) {
    const row = document.createElement("tr");
    row.appendChild(createCell("No roles available."));
    rolesRows.appendChild(row);
  } else {
    pageRoles.forEach((role) => {
      const row = document.createElement("tr");
      row.appendChild(createCell(role.name));
      row.appendChild(createCell(String(role.users)));
      row.appendChild(createCell(role.description));
      row.appendChild(createCell(getPermissions(role).join(", ")));
      rolesRows.appendChild(row);
    });
  }

  pageInfo.textContent = rolesData.length
    ? `Showing ${start + 1}-${Math.min(start + PAGE_SIZE, rolesData.length)} of ${rolesData.length} roles`
    : "No roles to show";

  pagination.replaceChildren();
  const previous = document.createElement("button");
  previous.type = "button";
  previous.textContent = "Previous";
  previous.disabled = currentPage === 1 || rolesData.length === 0;
  previous.setAttribute("aria-label", "Previous page");
  previous.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderOverview();
    }
  });

  const pageLabel = document.createElement("span");
  pageLabel.textContent = `Page ${currentPage} of ${totalPages}`;
  pageLabel.setAttribute("aria-live", "polite");

  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "Next";
  next.disabled = currentPage >= totalPages || rolesData.length === 0;
  next.setAttribute("aria-label", "Next page");
  next.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderOverview();
    }
  });

  pagination.append(previous, pageLabel, next);
}

function updateSaveStatus(message) {
  const hasChanges = Object.keys(pendingPermissions).length > 0;
  changesMessage.textContent = message || (hasChanges ? "Unsaved changes" : "All changes saved");
  changesMessage.dataset.state = hasChanges ? "pending" : "success";
  saveButton.disabled = !hasChanges;
}

function renderMatrix() {
  rolesHead.replaceChildren();
  rolesRows.replaceChildren();

  const headerRow = document.createElement("tr");
  headerRow.appendChild(createCell("Permission", "th"));
  rolesData.forEach((role) => headerRow.appendChild(createCell(role.name, "th")));
  rolesHead.appendChild(headerRow);

  getAllPermissions().forEach((permission) => {
    const row = document.createElement("tr");
    row.appendChild(createCell(permission));

    rolesData.forEach((role) => {
      const cell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = getPermissions(role).includes(permission);
      checkbox.setAttribute("aria-label", `${permission} permission for ${role.name}`);

      checkbox.addEventListener("change", () => {
        const current = [...getPermissions(role)];
        if (checkbox.checked && !current.includes(permission)) {
          current.push(permission);
        } else if (!checkbox.checked) {
          const index = current.indexOf(permission);
          if (index !== -1) current.splice(index, 1);
        }

        const original = role.permissions;
        const isSameAsSaved = current.length === original.length &&
          current.every((item) => original.includes(item));
        if (isSameAsSaved) {
          delete pendingPermissions[role.name];
        } else {
          pendingPermissions[role.name] = current;
        }

        renderMatrix();
      });

      cell.appendChild(checkbox);
      row.appendChild(cell);
    });
    rolesRows.appendChild(row);
  });

  updateSaveStatus();
}

function switchTab(tabName) {
  activeTab = tabName;
  const overviewTab = document.querySelector("#rolesOverviewTab");
  const matrixTab = document.querySelector("#rolesMatrixTab");

  overviewTab.classList.toggle("active", tabName === "overview");
  matrixTab.classList.toggle("active", tabName === "matrix");
  overviewTab.setAttribute("aria-selected", String(tabName === "overview"));
  matrixTab.setAttribute("aria-selected", String(tabName === "matrix"));
  overviewTab.tabIndex = tabName === "overview" ? 0 : -1;
  matrixTab.tabIndex = tabName === "matrix" ? 0 : -1;

  rolesPanel.setAttribute("aria-labelledby", tabName === "overview" ? "rolesOverviewTab" : "rolesMatrixTab");
  pagination.hidden = tabName === "matrix";
  pageInfo.hidden = tabName === "matrix";
  saveButton.hidden = tabName === "overview";
  changesMessage.hidden = tabName === "overview";

  if (tabName === "overview") renderOverview();
  else renderMatrix();
}

function savePermissions() {
  try {
    const updatedRoles = rolesData.map((role) => ({
      ...role,
      permissions: [...getPermissions(role)]
    }));
    const serialized = Object.fromEntries(
      updatedRoles.map((role) => [role.name, role.permissions])
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));

    rolesData = updatedRoles;
    pendingPermissions = {};
    if (activeTab === "matrix") renderMatrix();
    else renderOverview();
    updateSaveStatus("Changes saved successfully.");
  } catch (error) {
    console.error("Could not save permissions:", error);
    changesMessage.textContent = "Unable to save changes. Please try again.";
    changesMessage.dataset.state = "error";
  }
}

export function setupRoles(roles) {
  rolesPanel = document.querySelector("#rolesPanel");
  rolesHead = document.querySelector("#rolesHead");
  rolesRows = document.querySelector("#rolesRows");
  pageInfo = document.querySelector("#pageInfo");
  pagination = document.querySelector("#pagination");

  if (!rolesPanel || !rolesHead || !rolesRows || !pageInfo || !pagination) {
    console.error("Roles table elements are missing from index.html.");
    return;
  }

  const stored = loadSavedPermissions();
  const storedPermissions = Object.values(stored).filter(Array.isArray).flat();
  permissionCatalog = [...new Set([
    ...roles.flatMap((role) => role.permissions),
    ...storedPermissions
  ])];
  rolesData = roles.map((role) => ({
    ...role,
    permissions: Array.isArray(stored[role.name]) ? stored[role.name] : role.permissions
  }));
  pendingPermissions = {};

  // Keep permission save controls local to this feature module.
  const controls = document.createElement("div");
  controls.className = "permission-save-controls";
  changesMessage = document.createElement("span");
  changesMessage.setAttribute("role", "status");
  changesMessage.setAttribute("aria-live", "polite");

  saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "soft-btn";
  saveButton.textContent = "Save permissions";
  saveButton.addEventListener("click", savePermissions);

  controls.append(changesMessage, saveButton);
  rolesPanel.parentElement.insertBefore(controls, rolesPanel);

  document.querySelector("#rolesOverviewTab").addEventListener("click", () => switchTab("overview"));
  document.querySelector("#rolesMatrixTab").addEventListener("click", () => switchTab("matrix"));
  switchTab("overview");
}