import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export class CopyToClipboardButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      copied: false,
    }
  }

  onCopy = () => this.setState({ copied: Math.random() })

  componentDidUpdate(prevProps, prevState) {
    if (this.state.copied && this.state.copied !== prevState.copied) {
      const copied = this.state.copied
      setTimeout(() => {
        this.setState((state) => state.copied === copied ? { copied: undefined } : {})
      }, 3000)
    }
  }

  render() {
    return (
      <CopyToClipboard text={this.props.text} onCopy={this.onCopy}>
        <button className='btn btn-secondary btn-sm'>
          {this.state.copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </CopyToClipboard>
    )
  }
}
