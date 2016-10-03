import React from 'react';
import {Row, Col, FormControl} from 'react-bootstrap';
import * as _ from 'underscore';
import { SketchPicker } from 'react-color';
import Select from 'react-select';

class ComponentRow extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			op : undefined,
			input : '',

		}
	}

	changeOp = (op) => {
		this.setState(_.extend({}, this.state, {op : op}))
	}

	updateInput = (e) => {
		this.setState(_.extend({}, this.state, {input : e.target.value}));
	}

	extractCondition = () => {
		if(this.props.needsInput){
			var num = Number(this.state.input);
			if(this.state.op && !isNaN(this.state.input)){
				return `__arg__.properties.${this.props.id} ${this.state.op.value} ${num}`
			}
		}else if(this.state.op){
			return `__arg__.properties.${this.props.id} === ${this.state.op.value}`
		}
		return null;
	}

	render(){
		return(
			<div>
				<Col xs={3} style={styles.center}>
					<span style={{marginTop : 2}}>
						{this.props.label}
					</span>
				</Col>
				<Col xs={4}>
					<Select
						onChange={this.changeOp}
						value={this.state.op ? this.state.op.value : undefined}
						options={this.props.opOptions}
					/>
				</Col>
				{this.props.needsInput ? 
					<Col xs={2}>
						<FormControl
							type="text"
			                value={this.state.input}
			                onChange={this.updateInput}
						/>
					</Col> : null
				}
			</div>
		)
	}
}

export default class IndexComponent extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			color : 'red',
			showColorPicker : false,
		}
	}

	openColorPicker = () => {
		this.setState(_.extend({}, this.state, {showColorPicker : true}));
	}

	handleChangeComplete = (color) => {
		this.setState(_.extend({}, this.state, {color : color.hex}));
	}

	handleDivClick = (elem) => {
		if(this.state.showColorPicker && elem.target.id == this.props.id){
			this.setState(_.extend({}, this.state, {showColorPicker : false}));
		}
	}

	extractCondition = () => {
		var conds = [];
		for(var ref in this.refs){
			var cond = this.refs[ref].extractCondition();
			if(cond){
				conds.push(cond);
			}
		}
		return {
			cond : conds.join(' && '),
			color : this.state.color,
		}
	}

	render(){
		return(
			<div {...this.props} id={this.props.id} onClick={this.handleDivClick}>
				<Row id={this.props.id}>
					<Col xs={1}>
						<div 
							id={this.props.id}
							onClick={this.openColorPicker}
							style={{
								backgroundColor : this.state.color,
								width : 40,
								opacity : 0.5,
								height : 40,
							 	cursor : 'pointer',
							 	cursor: 'hand'
							}}
						></div>
					</Col>
					<ComponentRow
						needsInput
						id='pop_per_sq_km'
						ref='pop_per_sq_km'
						label='Population Density'
						opOptions={[
							{value : '>', label : 'is greater than'},
							{value : '<', label : 'is less than'},
							{value : '===', label : 'is equal to'}
						]}
					>
					</ComponentRow>
				</Row>
				<Row>
					<Col xs={1}></Col>
					<ComponentRow
						ref='zika_risk'
						id='zika_risk'
						label='Mosquito'
						opOptions={[
							{value : 'true', label : 'is present'},
							{value : 'false', label : 'is absent'},
						]}
					>
					</ComponentRow>
				</Row>
				<Row>
					<Col xs={1}></Col>
					<ComponentRow
						ref='care_delivery'
						id='care_delivery'
						label='Care Delivery'
						opOptions={[
							{value : 'true', label : 'is available'},
							{value : 'false', label : 'is unavailable'},
						]}
					>
					</ComponentRow>
				</Row>
				{this.state.showColorPicker && !this.props.hideColorPicker ? 
					<SketchPicker
						color={ this.state.color }
        				onChangeComplete={ this.handleChangeComplete }
					/> 
					: null}
			</div>
		)
	}
}

const styles={
	center : {
		display : 'flex',
		alignItems : 'center',	
	}
}

