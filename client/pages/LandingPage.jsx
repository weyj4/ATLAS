import React from 'react';
import {Button} from 'react-bootstrap'

export default class LandingPage extends React.Component{

	gotoMap = () => {
		this.context.router.push('/map')
	}

	render(){
		return(
			<div class='container-fluid' id="landing-page" style={{height : '100%', width : '100%'}}>

				<div class='row' style={{marginTop : 200}}>
					<p class='text-center' style={{fontSize : '15vh', color : 'white', fontFamily : 'sans-serif'}}>
						ATLAS
					</p>
				</div>

				<div class='row' style={{marginTop : 10}}>
					<div class='col-xs-2 col-xs-offset-5'>
						<Button bsStyle='primary' bsSize='large' onClick={this.gotoMap}>
							Map
						</Button>
					</div>
				</div>		

				<div style={{position : 'absolute', top : '80%', left : '15%'}}>
					<p id="tag-line" style={{color : 'white', fontSize : '2vh'}}>
						A comprehensive data <br/>
						engine for global health <br/>
						equity and security
					</p>
				</div>

			</div>
		)
	}
}

LandingPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}