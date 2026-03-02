import React from 'react'
import { translations, DEFAULT_LANGUAGE } from '../../utils/translations'
import './App.css'

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

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
    const t = translations[this.state.language]
    return (
      <div className="options-container">
        <div className="options-header">
          <div className="options-logo">
            <LogoIcon />
          </div>
          <h1 className="options-title">{t.settings}</h1>
        </div>
        <div className="options-card">
          <div className="options-section">
            <label className="options-label">Language / 語言</label>
            <div className="options-radio-group">
              <label className="options-radio-label">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={this.state.language === 'en'}
                  onChange={this.handleLanguageChange}
                />
                English
              </label>
              <label className="options-radio-label">
                <input
                  type="radio"
                  name="language"
                  value="zh-TW"
                  checked={this.state.language === 'zh-TW'}
                  onChange={this.handleLanguageChange}
                />
                繁體中文
              </label>
            </div>
          </div>
        </div>
        <div className="options-footer">
          <button className="save-btn" onClick={this.handleSave}>
            Save
          </button>
          {this.state.saved && (
            <span className="saved-feedback">✓ Saved!</span>
          )}
        </div>
      </div>
    )
  }
}
