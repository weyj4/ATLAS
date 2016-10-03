import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import * as IndexBuilderActions from 'atlas/actions/IndexBuilderActions';
import IndexComponent from 'atlas/components/IndexComponent';
import * as LayerActions from 'atlas/actions/LayerActions';

export default class IndexBuilder extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			components : [
				<IndexComponent 
					style={{paddingBottom : 10}} 
					key={0}
					id='__indexComponent0__'
					ref='__indexComponent0__'
				/>
			]
		}
	}

	cancel = () => {
		IndexBuilderActions.hideBuilder();
	}

	addComponent = () => {
		this.state.components.push(
			<IndexComponent 
				style={{paddingBottom : 10}} 
				key={this.state.components.length}
				id={`__indexComponent${this.state.components.length}__`}
				ref={`__indexComponent${this.state.components.length}__`}
			/>
		)
		this.setState(this.state);
	}

	addLayer = () => {
		var cases = [];
		var options = [];
		var self = this;
		for(var i = 0; i < this.state.components.length; i++){
			var comp = this.state.components[i];
			var res = this.refs[comp.ref].extractCondition();
			cases.push(`if(${res.cond}) return "${res.color}";`);
			options.push({label : `Component ${i}`, color : res.color})
		}
		cases = cases.join('\n');

		var fill = function(__arg__){
			var exp = '(function(__arg__){' + cases + '})(__arg__)';
			console.log(exp)
			return eval(exp)
		}
		LayerActions.addLayer({
			label : 'Custom Index 1',
			value : 'custom_index1',
			fill : fill,
			options : options,
			notes : [],
		})
		IndexBuilderActions.hideBuilder();
	}

	render(){
		return(
			<div className="static-modal">
			    <Modal.Dialog style={{top : 20, overflowY : 'initial'}} class='model-lg'>
			      	<Modal.Header>
			        	<Modal.Title>Create Custom Layer</Modal.Title>
			      	</Modal.Header>

			      	<Modal.Body style={{height : 300, overflowY : 'auto'}}>
			        	{this.state.components}
			      	</Modal.Body>

			      	<Modal.Footer>
			      		<Button class="pull-left" onClick={this.addComponent}>Add Component</Button>
			        	<Button onClick={this.cancel}>Cancel</Button>
			        	<Button onClick={this.addLayer} bsStyle="primary">Save Layer</Button>
			      	</Modal.Footer>

			    </Modal.Dialog>
			</div>
		)
	}
}