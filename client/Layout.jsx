/**
 * Layout - This is the component that renders all
 * pages as children
 * @flow
 */

import React from 'react'
import * as ErrorActions from './actions/ErrorActions'
import { Alert } from 'react-bootstrap'
import {connect} from 'react-redux'

export class Layout extends React.Component {
  render () {
    return (
      <div style={styles.container} id='layout-container' >
        {this.props.errorMsg ?
           <Alert bsStyle='danger' onDismiss={this.props.clearError} style={{marginBottom: 0}}>
             <strong><p class='text-center'> {this.props.errorMsg} </p></strong>
           </Alert> : null}
        {this.props.children}
        {
          this.props.popup ? 
            <div style={{position : 'absolute', top : 0, bottom : 0, left : 0, right : 0}}>
              <div style={styles.background}>
              </div>
              <div style={{zIndex : 40, height : '100%', width : '100%', display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
                {this.props.popup.component}
              </div>
            </div> : null
        }
      </div>
    )
  }
}

const mapStateToProps = (state : State) => ({
  errorMsg : state.errors.msg,
  popup : state.pages.popup
})

const mapDisptachToProps = dispatch => ({
  clearError : () => dispatch(ErrorActions.clearError)
})

const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow : 'scroll'
  },
  background : {
    position : 'absolute',
    top : 0,
    bottom : 0,
    right : 0, left : 0,
    backgroundColor : 'rgb(93,97,100)',
    opacity : 0.7,
    zIndex : 10
  }
}

Layout.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDisptachToProps)(Layout)
