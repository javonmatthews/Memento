// Listen for updated tabs 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // If the updated tab is incognito and the URL is reddit...
    // TODO: Generalize for multiple sites
    if (changeInfo.url && tab.incognito && changeInfo.url.includes("reddit.com")) {
      // Close the tab immediately
      chrome.tabs.remove(tabId);
    }
  });
  