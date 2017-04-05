import promiseMiddleware from 'redux-promise-middleware';
import ErrorReducer from './reducers/ErrorReducer'
import PagesReducer from './reducers/PagesReducer'
import MapReducer from './reducers/MapReducer'
import { createStore, combineReducers, applyMiddleware } from 'redux'

export const store = createStore(combineReducers({
  errors : ErrorReducer,
  pages : PagesReducer,
  map : MapReducer
}), {}, applyMiddleware(promiseMiddleware()))
