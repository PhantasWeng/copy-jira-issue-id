import React from 'react'
import { translations, DEFAULT_LANGUAGE } from '../../utils/translations'
import './App.css'

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
        <h1 className="options-title">{t.settings}</h1>
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
        <div className="options-actions">
          <button className="save-btn" onClick={this.handleSave}>
            Save
          </button>
          {this.state.saved && (
            <span className="saved-feedback">Saved!</span>
          )}
        </div>
      </div>
    )
  }
}
