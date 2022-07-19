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

const copyIcon = '<svg viewBox="64 64 896 896" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg>'

function inspectLink() {
  const aLinkList = document.querySelectorAll('a:not([data-testid*="notification"])')
  for (const link of aLinkList) {
    const regex = /browse\/([a-zA-Z]+-\d+)/
    const jiraId = regex.exec(link.href)?.[1]
    if (!link.dataset.copyJiraId && link?.href?.includes('browse') && jiraId) {
      // if (!link.className.includes('hover-copy-btn')) {
      //   link.className = link.className + ' hover-copy-btn'
      // }
      const button = document.createElement('button')
      button.innerHTML = copyIcon
      button.className = 'copy-jira-id-button'
      button.style.cursor = 'pointer'
      button.style.backgroundColor = 'transparent'
      button.style.border = 'none'
      button.style.fontSize = '12px'
      button.style.padding = '2px 6px'
      button.style.color = '#888'
      button.style.transition = 'color 0.6s ease'
      // button.style.display = 'none'

      button.onmouseenter = () => {
        button.style.color = '#179EEF'
      }
      button.onmouseleave = () => {
        button.style.color = '#888'
      }
      button.onclick = ($event) => {
        $event.stopPropagation()
        $event.preventDefault()
        copyToClipboard(jiraId)
        button.innerHTML = '✔︎'
        setTimeout(() => {
          button.innerHTML = copyIcon
        }, 600)
      }

      link.dataset.copyJiraId = true
      link.after(button)
    }
  }
}

const scan = setInterval(() => {
  inspectLink()
}, 1500)

window.onbeforeunload = function(){
  clearInterval(scan)
}