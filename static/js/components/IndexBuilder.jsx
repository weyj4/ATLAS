import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import * as IndexBuilderActions from 'atlas/actions/IndexBuilderActions';
import IndexComponent from 'atlas/components/IndexComponent';
import * as LayerActions from 'atlas/actions/LayerActions';
import addons from 'react-addons';
import {RIETextArea} from 'riek';
import * as _ from 'underscore';

export default class IndexBuilder extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			components : props.components ? props.components : [
				<IndexComponent 
					style={{paddingBottom : 10}} 
					key={0}
					id='__indexComponent0__'
					ref='__indexComponent0__'
				/>
			],
			layerName : props.layerName ? props.layerName : 'Custom Layer'
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
			return eval(exp)
		}
		LayerActions.addLayer({
			label : this.state.layerName,
			value : this.state.layerName,
			fill : fill,
			options : options,
			notes : [],
			editable : true,
			components : this.state.components,
			layerName : this.state.layerName,
		})
		IndexBuilderActions.hideBuilder();
	}

	changeLayerName = (arg) => {
		this.setState(_.extend({}, this.state, {layerName : arg.textarea}))
	}

	render(){
		var index = 0
		var children = React.Children.map(this.state.components, function(child){
			return React.cloneElement(child, {
				ref : `__indexComponent${index++}__`
			});
		});
		return(
			<div className="static-modal">
			    <Modal.Dialog style={{top : 20, overflowY : 'initial'}} class='model-lg'>
			      	<Modal.Header>
			        	<Modal.Title>
			        		<RIETextArea
								value={this.state.layerName}
								change={this.changeLayerName}
								propName="textarea"
								rows={1}
							/>
			        	</Modal.Title>
			      	</Modal.Header>

			      	<Modal.Body style={{height : 300, overflowY : 'auto'}}>
			        	{children}
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