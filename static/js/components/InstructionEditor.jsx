import React from 'react';
import {SafeAnchor} from 'react-bootstrap';
import * as InstructionEditorActions from 'atlas/actions/InstructionEditorActions';
import InstructionEditorStore from 'atlas/stores/InstructionEditorStore';
import * as MapActions from 'atlas/actions/MapActions';
import update from 'react/lib/update';

String.prototype.capFirstLetter = function(){
	return this.charAt(0) + this.slice(1).toLowerCase();
}


class MsgSender extends React.Component{
	constructor(props){
		super(props);
		this.state = {marker : props.marker};
	}

	text = () => {
		InstructionEditorActions.hideEditor();
		MapActions.addMarker(this.state.marker);
	}

	email = () => {
		InstructionEditorActions.hideEditor();
		MapActions.addMarker(this.state.marker);
	}

	render(){
		return(
			<div class="container-fluid">
				<div class="row">
					<p style={{fontSize : 20, textAlign : 'center', color : 'rgb(125,125,125)', marginTop : '5%'}}>
						How would you like to deliver your message?
					</p>
				</div>

				{
					[
						{label : 'TEXT', f : this.text}, 
						{label : 'EMAIL', f : this.email}, 
						{label : 'BACK', f : this.props.back}
					].map(b => 
						<div key={b.label}>
							<div class="row" style={{marginTop : 20}}>
								<div class="col-xs-3"></div>
								<div class="col-xs-6">
									<SafeAnchor style={{textDecoration : 'none'}} onClick={b.f}>
										<div 
											style={_.extend({}, styles.button, {
												height : '100%',
												width : '100%'
											})}
										>
									        <p style={{textAlign : 'center', verticalAlign : 'middle', lineHeight : '40px'}}>
									        	{b.label}
									        </p>
								        </div>
							        </SafeAnchor>
						        </div>
					        </div>
				        </div>
					)
				}
			</div>
		)
	}	
}


export default class InstructionEditor extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			marker : InstructionEditorStore.getMarker(),
		}
	}

	cancel = () => {
		InstructionEditorActions.hideEditor();
	}

	send = () => {

		this.setState(_.extend({}, this.state, {sendMessage : true}))
	}

	updateText = (event) => {
		this.setState(update(this.state, {
			marker : {
				text : {$set : event.target.value}
			}
		}))
	}

	render(){
		var info = {
			Coordinates : `(${this.state.marker.coordinates.lat.toFixed(4)}, ${this.state.marker.coordinates.lng.toFixed(4)})`,
			Department : this.state.marker.polygon.properties.department,
			Municipality : this.state.marker.polygon.properties.municipality,
			Date : this.state.marker.polygon.properties.date,
			'Clinic Confirmed Cases' : this.state.marker.polygon.properties.confirmed_clinic,
			'Lab Confirmed Cases' : this.state.marker.polygon.properties.confirmed_lab,
			'Suspected Cases' : this.state.marker.polygon.properties.suspected,
		}

		return(
			<div {...this.props}>
			{this.state.sendMessage ? 
				<MsgSender 
					marker={this.state.marker} 
					back={() => this.setState(_.extend({}, this.state, {sendMessage : false}))}
				/> : 
			<div>
				<div style={styles.idBadge}>
					<p style={styles.idNumber}>
						{this.state.marker.id}
					</p>
				</div>

				<div style={{marginTop : 30, marginLeft : 20}}>
				{
					Object.keys(info).map(k => 
						<div style={{textAlign : 'left'}} key={k}>
							<p><b>{k}</b>: {typeof(info[k]) == 'string' ? info[k].capFirstLetter() : info[k]}</p>
						</div>
					)
				}
				</div>

				<div style={styles.textBox}>
					<textarea
						style={{height : '100%', width : '100%', borderRadius : 20}}
						onChange={this.updateText}
						value={this.state.marker.text}
					/>
				</div>


		    	<SafeAnchor 
		    		style={_.extend({}, styles.button, {
		    			left : '10%',
		    			position : 'absolute',
		    			bottom : '7.3%',
		    			height : 40,
		    		})} 
		    		onClick={this.cancel}
		    	>
			        <p style={{verticalAlign : 'middle', lineHeight : '40px'}}>
			        	CANCEL
			        </p>
		        </SafeAnchor>
		        <SafeAnchor 
		    		style={_.extend({}, styles.button, {
		    			right : '10%',
		    			position : 'absolute',
		    			bottom : '7.3%',
		    			height : 40,
		    		})} 
		    		onClick={this.send}
		    	>
			        <p style={{verticalAlign : 'middle', lineHeight : '40px'}}>
			        	SEND
			        </p>
		        </SafeAnchor>
		    </div>
		    }
			</div>
		)
	}
}

const styles = {
	idNumber : {
		color : 'rgb(125,125,125)',
		fontSize : 40,
	},
	idBadge : {
		borderRadius : '50%',
		height : 85,
		width : 85,
		backgroundColor : 'rgb(216,216,216)',
		right : '7.65%',
		top : '7.41%',
		position : 'absolute',
		display : 'flex',
		justifyContent : 'center',
		alignContent : 'center',
		flexDirection : 'column',
		border : '1px solid rgb(151,151,151)',
	},
	button : {
		backgroundColor : 'rgb(216,216,216)',
		borderColor : 'rgb(151,151,151)',
		borderRadius : 20,
		width : '35%',
		color : 'rgb(125,125,125)',
		textDecoration : 'none',
	},
	textBox : {
		position : 'absolute',
		height : '20.24%',
		left : '10%',
		right : '10%',
		borderRadius : 20,
	}
}