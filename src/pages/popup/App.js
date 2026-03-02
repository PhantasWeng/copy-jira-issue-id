import React from 'react'
import { translations, DEFAULT_LANGUAGE } from '../../utils/translations'
import './App.css'

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
              >
                {copiedId === id ? '✓' : t.copyButton}
              </button>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="container">
        <div className="header">
          <span className="header-title">{t.title}</span>
          <button
            className="settings-btn"
            onClick={this.handleOpenSettings}
            title={t.settings}
          >
            ⚙
          </button>
        </div>
        <ContentBlock />
      </div>
    )
  }
}
