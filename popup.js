async function load() {
  const settings = await chrome.storage.local.get();
  
  document.getElementById("toggle").checked = settings.enabled ?? true;

  renderSites(settings.blockedSites || []);
  renderTimes(settings.timeRanges || []);
}

function renderSites(sites) {
  const list = document.getElementById("siteList");
  list.innerHTML = "";

  sites.forEach((site, index) => {
    const li = document.createElement("li");
    li.textContent = site;

    li.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      sites.splice(index, 1);
      await chrome.storage.local.set({ blockedSites: sites });
      load();
    });

    list.appendChild(li);
  });
}

function renderTimes(times) {
  const list = document.getElementById("timeList");
  list.innerHTML = "";

  times.forEach((t, index) => {
    const li = document.createElement("li");
    li.textContent = `${t.start} - ${t.end}`;

    li.addEventListener("contextmenu", async (e) => {
      e.preventDefault();
      times.splice(index, 1);
      await chrome.storage.local.set({ timeRanges: times });
      load();
    });

    list.appendChild(li);
  });
}

// ADD SITE
document.getElementById("addSite").onclick = async () => {
  const input = document.getElementById("newSite");
  const settings = await chrome.storage.local.get();

  const sites = settings.blockedSites || [];
  sites.push(input.value);

  await chrome.storage.local.set({ blockedSites: sites });
  input.value = "";
  load();
};

// ADD TIME
document.getElementById("addTime").onclick = async () => {
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  const settings = await chrome.storage.local.get();
  const times = settings.timeRanges || [];

  times.push({ start, end });

  await chrome.storage.local.set({ timeRanges: times });
  load();
};

// TOGGLE
document.getElementById("toggle").onchange = async (e) => {
  await chrome.storage.local.set({ enabled: e.target.checked });
};

load();