import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'

class MessageStore extends EventEmitter {
  constructor () {
    super()
    this.loadingMsg = undefined
  }

  setLoadingMsg = (msg) => {
    this.loadingMsg = msg
    this.emit('update-loading-msg')
  }

  getLoadingMsg = () => {
    return this.loadingMsg
  }

  handleActions = (action) => {
    switch (action.type) {
      case 'SET_LOADING_MSG':
        this.setLoadingMsg(action.msg)
        break
    }
  }
}

const messageStore = new MessageStore()

dispatcher.register(messageStore.handleActions)

export default messageStore
