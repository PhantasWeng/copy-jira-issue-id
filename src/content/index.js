// import { clipboard } from '@extend-chrome/clipboard'
// const styles = `.hover-copy-btn:hover + .copy-jira-id-button {display: inline-block !important;}`
// const stylesheet = document.createElement('style')
// stylesheet.innerText = styles
// document.head.appendChild(stylesheet)


function copyToClipboard(textToCopy) {
  navigator.clipboard.writeText(textToCopy).then(function () {
    console.log('clipboard copy success')
  }, function () {
    console.log('clipboard copy failed')
  })
}

console.log('%c[Copy Jira Id] %cInitialized', 'color: #F29D38', 'color: #9AE007')

const copyIcon = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const checkIcon = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'

function inspectLink() {
  const aLinkList = document.querySelectorAll('a:not([data-testid*="notification"]):not([data-testid*="permalink"])')
  for (const link of aLinkList) {
    const regex = /browse\/([a-zA-Z]+-\d+)/
    const jiraId = regex.exec(link.href)?.[1]
    if (!link.dataset.copyJiraId && link?.href?.includes('browse') && jiraId) {
      let floatingEl = null
      let hiding = false

      const showButton = () => {
        hiding = false
        if (!floatingEl) {
          floatingEl = document.createElement('div')
          floatingEl.style.cssText = `
            position: fixed;
            z-index: 2147483647;
            pointer-events: auto;
            opacity: 0;
            transition: opacity 0.1s ease;
          `
          floatingEl.innerHTML = `<div class="cjid-inner" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            background: #fff;
            border-radius: 4px;
            cursor: pointer;
            color: #8993A4;
            box-shadow: 0 1px 4px rgba(0,0,0,0.12);
            transition: color 0.1s ease;
          ">${copyIcon}</div>`
          const inner = floatingEl.querySelector('.cjid-inner')

          inner.addEventListener('mouseenter', () => {
            inner.style.color = '#0C66E4'
          })
          inner.addEventListener('mouseleave', () => {
            inner.style.color = '#8993A4'
            hideButton()
          })
          inner.addEventListener('click', ($event) => {
            $event.stopPropagation()
            $event.preventDefault()
            copyToClipboard(jiraId)
            inner.style.color = '#22A06B'
            inner.innerHTML = checkIcon
            setTimeout(() => {
              if (inner) {
                inner.innerHTML = copyIcon
                inner.style.color = '#8993A4'
              }
            }, 600)
          })
        }
        document.body.appendChild(floatingEl)
        const rect = link.getBoundingClientRect()
        floatingEl.style.top = (rect.top - 14) + 'px'
        floatingEl.style.left = (rect.right - 6) + 'px'
        requestAnimationFrame(() => {
          if (floatingEl) floatingEl.style.opacity = '1'
        })
      }

      const hideButton = () => {
        if (floatingEl && floatingEl.parentNode && !hiding) {
          hiding = true
          floatingEl.style.opacity = '0'
          const el = floatingEl
          setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el)
            hiding = false
          }, 120)
        }
      }

      link.addEventListener('mouseenter', showButton)
      link.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (floatingEl && !floatingEl.matches(':hover')) hideButton()
        }, 60)
      })

      link.dataset.copyJiraId = true
    }
  }
}

const scan = setInterval(() => {
  inspectLink()
}, 1500)

window.onbeforeunload = function(){
  clearInterval(scan)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getJiraIds') {
    const regex = /browse\/([a-zA-Z]+-\d+)/
    const seen = new Set()
    for (const link of document.querySelectorAll('a')) {
      const match = regex.exec(link.href)
      if (match) seen.add(match[1].toUpperCase())
    }
    const ids = Array.from(seen)
    if (ids.length === 0) {
      sendResponse({ ids: [] })
      return true
    }
    const jql = `key in (${ids.join(',')})`
    const url = `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&fields=issuetype&maxResults=100`
    fetch(url, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Jira API ${res.status}`)
        return res.json()
      })
      .then(data => {
        const typeMap = {}
        for (const issue of (data.issues || [])) {
          typeMap[issue.key] = issue.fields?.issuetype?.name || null
        }
        sendResponse({ ids: ids.map(id => ({ id, type: typeMap[id] || null })) })
      })
      .catch(() => {
        sendResponse({ ids: ids.map(id => ({ id, type: null })) })
      })
  }
  return true
})