import { clipboard } from '@extend-chrome/clipboard'

function copyToClipboard(textToCopy) {
  clipboard.writeText(textToCopy).then((text) => {
    console.log('clipboard contents', text)
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
          return copyToClipboard(regex1.exec(url)[1]);
        }
        if (regex2.test(url)) {
          console.debug('regex2', regex2.exec(url)[1])
          return copyToClipboard(regex2.exec(url)[1]);
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
  chrome.contextMenus.onClicked.addListener(() => {
    copyIssueId()
  });
})