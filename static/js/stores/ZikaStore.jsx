import { EventEmitter } from 'events'
import dispatcher from '../Dispatcher'

const BACKEND_URL = process.env.NODE_ENV === 'production' ?
  'http://ec2-54-149-176-177.us-west-2.compute.amazonaws.com' :
  'http://localhost:8080'

class ZikaStore extends EventEmitter {
  constructor () {
    super()
    this.dates = []
    this.dateIndex = 0
    $.get(`${BACKEND_URL}/GetZikaDates`).done((dates) => {
      this.dates = dates.map((d) => new Date(d).toDateString())
      this.emit('change-dates')
    }).fail((err) => {
      console.log(err)
    })
  }

  getDates = () => {
    return this.dates
  }

  getDateIndex = () => {
    return this.dateIndex
  }

  getDate = () => {
    return this.dates[this.dateIndex]
  }

  changeDateIndex = (index) => {
    this.dateIndex = index
    this.emit('change-date-index')
  }

  handleActions = (action) => {
    console.log(action)
    switch (action.type) {
      case 'CHANGE_DATE_INDEX':
        this.changeDateIndex(action.index)
        break
    }
  }
}

const zikaStore = new ZikaStore()

dispatcher.register(zikaStore.handleActions)

export default zikaStore
