import React from 'react'

const PLACEHOLDERS = [
  "Decide how I'm going to save the world tomorrow",
  "Figure out what's the best pizza",
  "Picking a new towel",
  "See the fnords",
]

const pickAtRandom = (arr) => arr[Math.floor(Math.random()*arr.length)]

export class DescriptionEditor extends React.Component {
  onChange = (event) => this.props.onChange(event.target.value)

  onKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault()
      this.props.onSubmit()
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      placeholder: pickAtRandom(PLACEHOLDERS),
    }
  }

  render() {
    return (
      <div>
        What are you working on?
        <input
          type='text'
          className='form-control'
          placeholder={this.state.placeholder}
          value={this.props.value}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}/>
      </div>
    )
  }
}
