import React from 'react'
import Map from 'atlas/components/Map'
import RiskMenu from 'atlas/components/RiskMenu'
import Legend from 'atlas/components/Legend'
import InstructionEditorStore from 'atlas/stores/InstructionEditorStore'
import * as _ from 'lodash'
import InstructionEditor from 'atlas/components/InstructionEditor'
import MessageStore from 'atlas/stores/MessageStore'
import * as MessageActions from 'atlas/actions/MessageActions'
import LoadingMessage from 'atlas/components/LoadingMessage'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showEditor: InstructionEditorStore.getVisibility()
    }
  }

  updateShowState = () => {
    this.setState(_.extend({}, this.state, {
      showEditor: InstructionEditorStore.getVisibility()
    }))
  }

  updateLoadingMsg = () => {
    this.setState(_.extend({}, this.state, {
      loadingMsg: MessageStore.getLoadingMsg()
    }))
  }

  componentWillMount () {
    InstructionEditorStore.on('change-visibility', this.updateShowState)
    MessageStore.on('update-loading-msg', this.updateLoadingMsg)
  }

  componentWillUnmount () {
    InstructionEditorStore.removeListener('change-visibility', this.updateShowState)
    MessageStore.removeListener('update-loading-msg', this.updateLoadingMsg)
  }

  render () {
    return (
      <div style={styles.container}>
        <Map style={styles.map} />
        {/*<Legend style={styles.legend} />*/}
        {this.state.loadingMsg ?
           <LoadingMessage style={styles.loadingMsg} message={this.state.loadingMsg} />
           : null}
        {this.state.showEditor ?
           <div>
             <div style={styles.backgroundOpacity}>
             </div>
             <InstructionEditor style={styles.instructionEditor} />
           </div> : null}
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
  },
  legend: {
    width: '80%',
    position: 'absolute',
    bottom: '5%',
    zIndex: 2,
    height: 125,
    left: '12%',
    right: '12%',
    borderRadius: 20
  },
  instructionEditor: {
    position: 'absolute',
    zIndex: 5,
    borderRadius: 20,
    left: '22.35%',
    top: '3.58%',
    opacity: 1,
    backgroundColor: 'white',
    right: '22.35%',
    height: 400,
    margin: 10
  },
  backgroundOpacity: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.6,
    zIndex: 2,
    backgroundColor: 'white'
  }
}
