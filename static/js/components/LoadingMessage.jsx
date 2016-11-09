import React from 'react'
import * as _ from 'lodash'

export default class LoadingMessage extends React.Component {
  static propTypes = {
    /*
     * function that generates the message (tick) => string/component
     * `tick` is a monotonically increasing integer
     */
    message: React.PropTypes.func.isRequired,
    /* 
     * number specifying the tick interval used
     * to update the message in seconds (default 0.5)
     */
    interval: React.PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {
      tick: 0
    }
  }

  incTick = () => {
    this.setState(_.extend({}, this.state, {
      tick: this.state.tick + 1
    }))
  }

  componentWillMount () {
    var interval = this.props.interval || 0.5
    this.timer = setInterval(this.incTick, interval * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    console.log('loading message')
    return (
      <div style={this.props.style}>
        {this.props.message(this.state.tick)}
      </div>
    )
  }
}
