import React from 'react'
import Map from 'atlas/components/Map';
import RiskMenu from 'atlas/components/RiskMenu';
import Legend from 'atlas/components/Legend';
import InstructionEditorStore from 'atlas/stores/InstructionEditorStore';
import * as _ from 'lodash';
import InstructionEditor from 'atlas/components/InstructionEditor';

export default class Main extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			showEditor : InstructionEditorStore.getVisibility(),
		}
	}

	updateShowState = () => {
		this.setState(_.extend({}, this.state, {
			showEditor : InstructionEditorStore.getVisibility(),
		}))
	}

	componentWillMount(){
		InstructionEditorStore.on('change-visibility', this.updateShowState);
	}

	componentWillUnmount(){
		InstructionEditorStore.removeListener('change-visibility', this.updateShowState);
	}

	render(){
		return(
			<div
				style={{
					height : '100%',
					width : '100%',
					position : 'absolute',
					textAlign : 'center',
				}}
			>
				<Map 
					style={{
						width : '100%',
						height : '100%',
						position : 'absolute',
					}}
				/>
				<Legend
					style={{
						width : '80%',
						position : 'absolute',
						bottom : '5%',
						zIndex : 2,
						height : 125,
						left : '12%',
						right : '12%',
						borderRadius : 20,
					}}
				/>
				{
					this.state.showEditor ? 
						<div>
							<div 
								style={{
									position : 'absolute',
									top : 0,
									bottom : 0, 
									left : 0,
									right : 0,
									opacity : 0.6,
									zIndex : 2,
									backgroundColor : 'white',
								}}
							>
							</div>
							<InstructionEditor
								style={{
									position : 'absolute',
									zIndex : 5,
									borderRadius : 20,
									left : '22.35%',
									top : '3.58%',
									opacity : 1,
									backgroundColor : 'white',
									right : '22.35%',
									height : 400,
									margin : 10,
								}}
							/>
						</div> : null
				}
			</div>
		)
	}
}