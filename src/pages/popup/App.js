import React from 'react'
import { clipboard } from '@extend-chrome/clipboard'
import './App.css'
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isJira: null,
      url: null,
      issueId: null,
      isCopying: false,
      isSuccess: false
    }
  }

  componentDidMount = () => {
    const isJira = /atlassian\.net/
    const regex1 = /atlassian\.net\/browse\/([a-zA-Z]+-\d+)/
    const regex2 = /atlassian\.net\/.*selectedIssue=([a-zA-Z]+-\d+)/
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      this.setState({
        isJira: isJira.test(url),
        url: url
      })
      if (isJira.test(url)) {
        if (regex1.test(url)) {
          console.debug('regex1', regex1.exec(url)[1])
          this.setState({
            issueId: regex1.exec(url)[1]
          })
        }
        if (regex2.test(url)) {
          console.debug('regex2', regex2.exec(url)[1])
          this.setState({
            issueId: regex2.exec(url)[1]
          })
        }
      }
    })
  }
  handleClick = () => {
    this.setState({
      isCopying: true
    })
    clipboard.writeText(this.state.issueId).then((text) => {
      this.setState({
        isCopying: false,
        isSuccess: true
      })
      const _this = this
      setTimeout(() => {
        _this.setState({
          isSuccess: false
        })
      }, 600)
      console.log('clipboard contents', text)
    })
  }

  render() {
    const CopyStatus = () => {
      if (this.state.isSuccess) {
        return <span style={{ color: 'green', margin: '0 4px' }}>Success</span>
      } else {
        return null
      }
    }
    const IsJiraPage = (props) => {
      return <div>
        <p>在 Jira 的 Issue 頁面上，點選右鍵即可複製</p>
        <div>
          <span style={{ marginLeft: '8px', fontSize: '12px' }}>{ this.state.issueId }</span>
          <button className='copy-btn' onClick={this.handleClick}>複製ID</button>
          <CopyStatus />
        </div>
      </div>
    }
    function NotJiraPage (props) {
      return <div>這不是一個 Jira Issue 的頁面</div>
    }
    const ContentBlock = () => {
      if (this.state.isJira) {
        return <IsJiraPage />
      } else {
        return <NotJiraPage />
      }
    }
    return (
      <div style={{ minWidth: '400px' }}>
      <div>
        <h1 style={{ fontSize: '14px' }}>Jira Issue's ID</h1>
        <ContentBlock />
      </div>
    </div>
    )
  }
}