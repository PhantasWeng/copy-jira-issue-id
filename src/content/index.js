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

const copyIcon = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const checkIcon = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'

function inspectLink() {
  const aLinkList = document.querySelectorAll('a:not([data-testid*="notification"])')
  for (const link of aLinkList) {
    const regex = /browse\/([a-zA-Z]+-\d+)/
    const jiraId = regex.exec(link.href)?.[1]
    if (!link.dataset.copyJiraId && link?.href?.includes('browse') && jiraId) {
      let floatingBtn = null

      const showButton = () => {
        if (!floatingBtn) {
          floatingBtn = document.createElement('button')
          floatingBtn.innerHTML = copyIcon
          floatingBtn.style.cssText = `
            position: fixed;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            cursor: pointer;
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 6px;
            padding: 0;
            color: #505F79;
            z-index: 2147483647;
            line-height: 1;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04);
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
          `
          floatingBtn.onmouseenter = () => {
            floatingBtn.style.color = '#0065FF'
            floatingBtn.style.background = 'rgba(0,101,255,0.08)'
            floatingBtn.style.borderColor = 'rgba(0,101,255,0.25)'
            floatingBtn.style.boxShadow = '0 2px 8px rgba(0,101,255,0.15), 0 0 0 0.5px rgba(0,101,255,0.1)'
          }
          floatingBtn.onmouseleave = () => {
            floatingBtn.style.color = '#505F79'
            floatingBtn.style.background = 'rgba(255,255,255,0.92)'
            floatingBtn.style.borderColor = 'rgba(0,0,0,0.08)'
            floatingBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)'
            hideButton()
          }
          floatingBtn.onclick = ($event) => {
            $event.stopPropagation()
            $event.preventDefault()
            copyToClipboard(jiraId)
            floatingBtn.innerHTML = checkIcon
            floatingBtn.style.color = '#36B37E'
            floatingBtn.style.background = 'rgba(54,179,126,0.08)'
            floatingBtn.style.borderColor = 'rgba(54,179,126,0.25)'
            floatingBtn.style.boxShadow = '0 2px 8px rgba(54,179,126,0.15), 0 0 0 0.5px rgba(54,179,126,0.1)'
            setTimeout(() => {
              if (floatingBtn) {
                floatingBtn.innerHTML = copyIcon
                floatingBtn.style.color = '#505F79'
                floatingBtn.style.background = 'rgba(255,255,255,0.92)'
                floatingBtn.style.borderColor = 'rgba(0,0,0,0.08)'
                floatingBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)'
              }
            }, 600)
          }
        }
        const rect = link.getBoundingClientRect()
        floatingBtn.style.top = (rect.top + (rect.height / 2) - 12) + 'px'
        floatingBtn.style.left = (rect.right + 4) + 'px'
        document.body.appendChild(floatingBtn)
        requestAnimationFrame(() => {
          if (floatingBtn) {
            floatingBtn.style.opacity = '1'
            floatingBtn.style.transform = 'scale(1)'
          }
        })
      }

      const hideButton = () => {
        if (floatingBtn && floatingBtn.parentNode) {
          floatingBtn.style.opacity = '0'
          floatingBtn.style.transform = 'scale(0.8)'
          const btn = floatingBtn
          setTimeout(() => {
            if (btn.parentNode) btn.parentNode.removeChild(btn)
          }, 150)
        }
      }

      link.addEventListener('mouseenter', showButton)
      link.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (floatingBtn && !floatingBtn.matches(':hover')) hideButton()
        }, 50)
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