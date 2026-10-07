const integrations=[["Salesforce CRM",true],["Google Analytics",false],["Stack",true],["Microsoft Teams",true],["Microsoft Teams",true]];
const roles=[["Admin",5,"Full access to all features setting"],["Business Analyst",18,"Access to analytics, reports and dashboards"],["Editor",32,"Can edit reports and dashboards"],["Viewer",120,"View only access to reports and dashboards"]];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}
function renderIntegrations(){ $("#integrationRows").innerHTML=integrations.map((x,i)=>`<tr><td>${x[0]}</td><td><span class="status ${x[1]?"":"inactive"}">${x[1]?"Active":"Inactive"}</span></td><td><button class="small" data-int="${i}">${x[1]?"Disconnect":"Connect"}</button></td></tr>`).join("")}
function renderRoles(){const matrix=window.matrix||false;$("#roleHead").innerHTML=matrix?"<tr><th>Role</th><th>Analytics</th><th>Reports</th><th>Users</th><th>Settings</th></tr>":"<tr><th>Role Name</th><th>Users</th><th>Description</th><th>Action</th></tr>";$("#roleRows").innerHTML=roles.map(r=>matrix?`<tr><td>${r[0]}</td><td>✓</td><td>${r[0]==="Viewer"?"—":"✓"}</td><td>${r[0]==="Admin"?"✓":"—"}</td><td>${r[0]==="Admin"?"✓":"—"}</td></tr>`:`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><button class="small">⋮</button></td></tr>`).join("");$("#pageInfo").textContent=matrix?"Permission access by role":`Showing 1 to 4 of 4 roles`;$("#pagination").innerHTML=matrix?"":"<button class='active'>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>Next ›</button>"}
renderIntegrations();renderRoles();
$$(".section-head").forEach(b=>b.onclick=()=>{const x=$("#"+b.dataset.target),open=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",!open);x.classList.toggle("hidden",open)});
$("#generalForm").onsubmit=e=>{e.preventDefault();toast("General settings saved (demo).")};
$("#notificationForm").onsubmit=e=>{e.preventDefault();toast("Notification preferences updated (demo).")};
$("#securityForm").onsubmit=e=>{e.preventDefault();toast("Security settings saved (demo).")};
$("#showPassword").onclick=()=>{const p=$("#password"),show=p.type==="password";p.type=show?"text":"password";$("#showPassword").textContent=show?"Hide":"Show"};
$("#integrationRows").onclick=e=>{const b=e.target.closest("[data-int]");if(!b)return;integrations[b.dataset.int][1]=!integrations[b.dataset.int][1];renderIntegrations();toast("Integration status changed (demo).")};
$$(".switch input").forEach(i=>i.onchange=()=>i.parentElement.querySelector("em").textContent=i.checked?"ON":"OFF");
$$("[data-tab]").forEach(b=>b.onclick=()=>{$$("[data-tab]").forEach(x=>x.classList.remove("active"));b.classList.add("active");window.matrix=b.dataset.tab==="matrix";renderRoles()});
$("#search").oninput=e=>{const q=e.target.value.toLowerCase();$$(".searchable").forEach(x=>x.classList.toggle("hidden",q&&!((x.dataset.keywords+" "+x.textContent).toLowerCase().includes(q))))};
$("#clearSearch").onclick=()=>{$("#search").value="";$("#search").dispatchEvent(new Event("input"));$("#search").focus()};
$("#sidebarToggle").onclick=()=>$("#sidebar").classList.toggle("collapsed");
$("#mobileMenu").onclick=()=>$("#sidebar").classList.toggle("open");
$("#askAi").onclick=()=>toast("AI Assistant demo.");
$("#floatingAi").onclick=()=>toast("AI Assistant demo.");
$("#bell").onclick=()=>toast("You are all caught up.");
$("#profile").onclick=()=>toast("Sample profile: Alin.");
