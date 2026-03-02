async function copyToClipboard(tabId, textToCopy) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (text) => navigator.clipboard.writeText(text),
    args: [textToCopy]
  })
}

async function copyIssueId() {
  const isJira = /atlassian\.net/
  const regex1 = /atlassian\.net\/browse\/([a-zA-Z]+-\d+)/
  const regex2 = /atlassian\.net\/.*selectedIssue=([a-zA-Z]+-\d+)/
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0]
    if (tab) {
      const url = tab.url
      if (isJira.test(url)) {
        if (regex1.test(url)) {
          console.debug('regex1', regex1.exec(url)[1])
          return copyToClipboard(tab.id, regex1.exec(url)[1]);
        }
        if (regex2.test(url)) {
          console.debug('regex2', regex2.exec(url)[1])
          return copyToClipboard(tab.id, regex2.exec(url)[1]);
        }
      }
    }
  })
}

// Create the context menu.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'JiraCopyContextMenus',
    title: 'Jira Issue ID',
    documentUrlPatterns: ["*://*.atlassian.net/*"]
  });
})

// MV3: listeners must be registered at top level, not inside onInstalled
chrome.contextMenus.onClicked.addListener(() => {
  copyIssueId()
})
