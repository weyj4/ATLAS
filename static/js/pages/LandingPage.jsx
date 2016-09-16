import React from 'react';

export default class LandingPage extends React.Component{



	render(){
		console.log('/images/LandingImage/1.svg')
		return(
			<div id="landing-page" style={{height : '100%', width : '100%'}}>
				<div style={{position : 'absolute', top : '50%', margin : '0 auto', width : '100%'}}>
					<p style={{textAlign : 'center', fontSize : '15vh', color : 'white', fontFamily : 'sans-serif'}}>
						ATLAS
					</p>
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