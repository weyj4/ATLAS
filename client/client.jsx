/**
 * Main entry point of the app
 * @flow
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRedirect, Redirect } from 'react-router'
import Layout from './Layout'
import LandingPage from './pages/LandingPage'
import MapPage from './pages/MapPage'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import {Provider} from 'react-redux'
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk'
import ErrorReducer from './reducers/ErrorReducer'
import PagesReducer from './reducers/PagesReducer'
import MapReducer from './reducers/MapReducer'

const store = createStore(combineReducers({
  errors : ErrorReducer,
  pages : PagesReducer,
  map : MapReducer
}), {}, applyMiddleware(thunk, promiseMiddleware()))

const app = document.getElementById('app')


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={Layout}>
        <IndexRedirect to='landing' />,
        <Route path='/landing' component={LandingPage} />
        <Route path='/map' component={MapPage} />
      </Route>
    </Router>
  </Provider>,
  app
)
