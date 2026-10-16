const DEFAULTS = {
  enabled: true,
  blockedSites: ["iltalehti.fi", "is.fi"],
  timeRanges: [] // { start: "08:00", end: "16:00" }
};

async function getSettings() {
  const data = await chrome.storage.local.get(DEFAULTS);
  return { ...DEFAULTS, ...data };
}

async function saveSettings(settings) {
  return chrome.storage.local.set(settings);
}