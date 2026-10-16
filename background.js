importScripts("storage.js");

function isWithinTimeRange(ranges) {
  if (!ranges.length) return true;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return ranges.some(r => {
    const [sh, sm] = r.start.split(":").map(Number);
    const [eh, em] = r.end.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    return currentMinutes >= start && currentMinutes <= end;
  });
}

// function shouldClose(url, blockedSites) {
//   return blockedSites.some(site => url.includes(site));
// }

// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   if (!tab.url) return;

//   const settings = await getSettings();

//   if (!settings.enabled) return;
//   if (!isWithinTimeRange(settings.timeRanges)) return;

//   if (shouldClose(tab.url, settings.blockedSites)) {
//     chrome.tabs.remove(tabId);
//   }
// });

async function scanAndCloseTabs() {
  const settings = await getSettings();

  if (!settings.enabled) return;
  if (!isWithinTimeRange(settings.timeRanges)) return;

  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (tab.url && shouldClose(tab.url, settings.blockedSites)) {
      chrome.tabs.remove(tab.id);
    }
  }
}

// aja 15 sek välein
setInterval(scanAndCloseTabs, 15000);