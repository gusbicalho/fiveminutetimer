import React from 'react'

export class Toggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: !!props.initialStatus,
    }
  }

  toggle = () =>
    this.setState(({ status }) => ({ status: !status }))

  render() {
    return this.props.children({
      toggle: this.toggle,
      status: this.state.status,
    })
  }
}
