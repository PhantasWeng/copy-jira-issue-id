import React from 'react'
import { translations, DEFAULT_LANGUAGE } from '../../utils/translations'
import './App.css'

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isJira: null,
      ids: [],
      copiedId: null,
      language: DEFAULT_LANGUAGE,
      loaded: false,
    }
  }

  componentDidMount = () => {
    chrome.storage.sync.get('language', (result) => {
      const language = result.language || DEFAULT_LANGUAGE
      this.setState({ language })

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url
        const isJira = /atlassian\.net/.test(url)
        if (!isJira) {
          this.setState({ isJira: false, loaded: true })
          return
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getJiraIds' }, (response) => {
          if (chrome.runtime.lastError || !response) {
            this.setState({ isJira: true, ids: [], loaded: true })
            return
          }
          this.setState({ isJira: true, ids: response.ids || [], loaded: true })
        })
      })
    })
  }

  typeBadgeClass = (type) => {
    return 'type-badge type-badge--' + (type || 'unknown').toLowerCase().replace(/[\s-]+/g, '-')
  }

  handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      this.setState({ copiedId: id })
      setTimeout(() => {
        this.setState({ copiedId: null })
      }, 600)
    })
  }

  handleOpenSettings = () => {
    chrome.runtime.openOptionsPage()
  }

  render() {
    const t = translations[this.state.language]
    const { isJira, ids, copiedId, loaded } = this.state
    const extensionIcon =
      typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
        ? chrome.runtime.getURL('img/icon128.png')
        : '../../img/icon128.png'

    const ContentBlock = () => {
      if (!loaded) return null
      if (!isJira) return <div className="empty-state">{t.notJiraPage}</div>
      if (ids.length === 0) return <div className="empty-state">{t.noIdsFound}</div>
      return (
        <ul className="id-list">
          {ids.map(({ id, type }) => (
            <li key={id} className="id-row">
              <span className="id-info">
                <span className={this.typeBadgeClass(type)}>{type || '?'}</span>
                <span className="id-text">{id}</span>
              </span>
              <button
                className={`copy-btn${copiedId === id ? ' copy-btn--success' : ''}`}
                onClick={() => this.handleCopy(id)}
                title={copiedId === id ? t.success : t.copyButton}
              >
                {copiedId === id ? <CheckIcon /> : <CopyIcon />}
              </button>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="container">
        <div className="header">
          <span className="header-title-wrap">
            <span className="header-logo" aria-hidden="true">
              <img src={extensionIcon} alt="" className="header-logo-image" />
            </span>
            <span className="header-title">{t.title}</span>
          </span>
          <button
            className="settings-btn"
            onClick={this.handleOpenSettings}
            title={t.settings}
          >
            <SettingsIcon />
          </button>
        </div>
        <ContentBlock />
      </div>
    )
  }
}
