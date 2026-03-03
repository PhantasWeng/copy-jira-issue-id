import React from 'react'
import { DEFAULT_LANGUAGE } from '../../utils/translations'
import './App.css'

const SETTINGS_COPY = {
  en: {
    pageLabel: 'Product Settings',
    extensionName: 'Copy Jira Issue ID',
    subtitle: 'Your control center for faster Jira issue-key copying.',
    scopeLabel: 'Works on',
    scopeValue: '*.atlassian.net issue pages',
    actionLabel: 'Core behavior',
    actionValue: 'Extract and copy the issue key from the current ticket',
    languageTitle: 'Experience Language',
    languageHint: 'Set the language for popup labels, actions, and messages.',
    save: 'Apply Changes',
    saved: 'Changes Applied',
  },
  'zh-TW': {
    pageLabel: '產品設定',
    extensionName: 'Copy Jira Issue ID',
    subtitle: '你的 Jira Issue Key 快速複製控制台，讓日常追蹤更流暢。',
    scopeLabel: '適用範圍',
    scopeValue: '*.atlassian.net 的 Jira Issue 頁面',
    actionLabel: '核心功能',
    actionValue: '擷取並複製目前票卡的 Issue Key',
    languageTitle: '體驗語言',
    languageHint: '設定 popup 標籤、操作提示與訊息顯示語言。',
    save: '套用變更',
    saved: '已套用',
  },
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      language: DEFAULT_LANGUAGE,
      saved: false,
    }
  }

  componentDidMount() {
    chrome.storage.sync.get('language', (result) => {
      if (result.language) {
        this.setState({ language: result.language })
      }
    })
  }

  handleLanguageChange = (e) => {
    this.setState({ language: e.target.value })
  }

  handleSave = () => {
    chrome.storage.sync.set({ language: this.state.language }, () => {
      this.setState({ saved: true })
      setTimeout(() => this.setState({ saved: false }), 1500)
    })
  }

  render() {
    const content = SETTINGS_COPY[this.state.language] || SETTINGS_COPY.en
    const extensionIcon =
      typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
        ? chrome.runtime.getURL('img/icon128.png')
        : '../../img/icon128.png'

    return (
      <div className="options-container">
        <div className="bg-shape bg-shape-one" aria-hidden="true" />
        <div className="bg-shape bg-shape-two" aria-hidden="true" />

        <header className="options-hero">
          <div className="hero-pill">{content.pageLabel}</div>

          <div className="hero-title-row">
            <div className="hero-logo" aria-hidden="true">
              <img src={extensionIcon} alt="" className="hero-logo-image" />
            </div>
            <div className="hero-title-block">
              <h1 className="hero-title">{content.extensionName}</h1>
              <p className="hero-subtitle">{content.subtitle}</p>
            </div>
          </div>

          <div className="hero-meta-grid">
            <div className="meta-item">
              <span className="meta-label">{content.scopeLabel}</span>
              <span className="meta-value">{content.scopeValue}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">{content.actionLabel}</span>
              <span className="meta-value">{content.actionValue}</span>
            </div>
          </div>
        </header>

        <section className="options-card" aria-label="Language settings">
          <h2 className="card-title">{content.languageTitle}</h2>
          <p className="card-hint">{content.languageHint}</p>

          <div className="options-radio-group">
            <label className="options-radio-label">
              <input
                type="radio"
                name="language"
                value="en"
                checked={this.state.language === 'en'}
                onChange={this.handleLanguageChange}
              />
              <span>English</span>
            </label>

            <label className="options-radio-label">
              <input
                type="radio"
                name="language"
                value="zh-TW"
                checked={this.state.language === 'zh-TW'}
                onChange={this.handleLanguageChange}
              />
              <span>繁體中文</span>
            </label>
          </div>
        </section>

        <div className="options-footer">
          <button className="save-btn" onClick={this.handleSave}>
            {content.save}
          </button>
          {this.state.saved && <span className="saved-feedback">{content.saved}</span>}
        </div>
      </div>
    )
  }
}
