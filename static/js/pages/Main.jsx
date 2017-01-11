import React from 'react'
import Map from 'atlas/components/Map'
import * as _ from 'lodash'
import LoadingMessage from 'atlas/components/LoadingMessage'
import MessageStore from 'atlas/stores/MessageStore'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  updateLoadingMsg = () => {
    this.setState(_.extend({}, this.state, {
      loadingMsg: MessageStore.getLoadingMsg()
    }))
  }

  componentWillMount () {
    MessageStore.on('update-loading-msg', this.updateLoadingMsg)
  }

  componentWillUnmount () {
    MessageStore.removeListener('update-loading-msg', this.updateLoadingMsg)
  }

  render () {
    return (
      <div style={styles.container}>
        <Map style={styles.map} />
        {this.state.loadingMsg ?
           <LoadingMessage style={styles.loadingMsg} message={this.state.loadingMsg} />
           : null}
      </div>
    )
  }
}

const styles = {
  loadingMsg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    textAlign: 'center'
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}
