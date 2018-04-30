import React from 'react'

export class DescriptionEditor extends React.Component {
  onChange = (event) => this.props.onChange(event.target.value)

  onKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault()
      this.props.onSubmit()
    }
  }

  render() {
    return (
      <div>
        What are you working on?
        <input
          type="text"
          className="form-control"
          value={this.props.value}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}/>
      </div>
    )
  }
}
