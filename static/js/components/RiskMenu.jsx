import React from 'react';
import {Row, Col} from 'react-bootstrap'
var _ = require('underscore');
import Select from 'react-select';
var d3 = require('d3');
import Measure from 'react-measure';

export default class RiskMenu extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			diseases : [{label : 'Dengue', value : 'dengue'}, {label : 'Zika', value : 'zika'}],
			selectedDisease : {value : 'zika', label : 'Zika'}
		}
	}

	changeDisease = (disease) => {
		this.setState(_.extend({}, this.state, {
			selectedDisease : disease
		}))
	}

	clear = () => {
		const container = this.refs.colorBar;
		for (const child of Array.from(container.childNodes)) {
			container.removeChild(child);
		}
	}

	drawColorBar = () => {
		if(this.state.width){
			var width = this.state.width;
			var height = 30;
			var svg = d3.select(this.refs.colorBar).append("svg")
			    .attr("width", width)
			    .attr("height", height);

			var defs = svg.append('defs')
			var linearGradient = defs.append("linearGradient")
	    		.attr("id", "linear-gradient");

	    	linearGradient
			    .attr("x1", "0%")
			    .attr("y1", "0%")
			    .attr("x2", "100%")
			    .attr("y2", "0%");

			linearGradient.append('stop')//Start color
				.attr('offset', '0%')
				.attr('stop-color', 'blue')

			linearGradient.append('stop')//End color
				.attr('offset', '100%')
				.attr('stop-color', 'red')

			svg.append("rect")
				.attr("width", width)
				.attr("height", height)
				.style("fill", "url(#linear-gradient)");
		}
	}

	componentDidMount(){
		this.drawColorBar();
	}

	componentDidUpdate = () => {
		this.clear()
		this.drawColorBar()
	}

	render(){
		return(
			<div style={_.extend({}, this.props.style, {backgroundColor : 'white', zIndex : 1})}>
				<div style={{width : '80%', margin : '0 auto', position : 'relative', top : 30}}>
					<Select
						value={this.state.selectedDisease ? this.state.selectedDisease.value : undefined}
						options={this.state.diseases}
						onChange={this.changeDisease}
					/>
				</div>

				<div style={{position : 'relative', paddingLeft : 30, 'top' : 30}}>
					<p style={{fontSize : 25}}>{this.state.selectedDisease.label} Risk</p>
					
				</div>
{/*	
				<div style={{position : 'relative', top : 30, margin : '0 auto', width : '70%'}} ref="colorBar">
					<Measure onMeasure={(dimensions) => this.setState(_.extend({}, this.state, dimensions))}>
						<div></div>
					</Measure>	
				</div>
			*/}
				{/*
				<div style={{display : 'table', position : 'relative', top : 30, margin : '0 auto', width : '100%', height : 20}}>
						<div style={{display : 'table-row'}}>
							<div style={{display : 'table-cell', textAlign : 'center'}}>Low</div>
							<div style={{width : '70%', height : '100%', display : 'table-cell', textAlign : 'center'}} ref="colorBar">
								<Measure onMeasure={(dimensions) => this.setState(_.extend({}, this.state, dimensions))}>
									<div></div>
								</Measure>	
							</div>
							<div style={{display : 'table-cell', textAlign : 'center'}}>High</div>
						</div>
				</div>

				<div style={{height : 30}}/>*/}

				<table style={{position : 'relative', 'margin' : '0 auto', top : 30, width : '90%'}}>
					<tbody>
						{
							[{color : 'red', msg : 'Level 1 Cold Spot'}, {color : 'orange', msg : 'Level 2 Cold Spot'},
							 {color : 'yellow', msg : 'Level 3 Cold Spot'}, {color : 'lightgray', msg : 'Stable'}].map((elem) => 
							 	<tr key={elem.color}>
							 		<td style={{paddingBottom : '1em'}}>
										<div style={_.extend({}, styles.cell, {color : elem.color, backgroundColor : elem.color})}></div>
									</td>
									<td style={{align : 'left', paddingBottom : '1em'}}>
										{elem.msg}
									</td>
							 	</tr>
							 )

						}
					</tbody>
				</table>

				{/*
				<div style={{position : 'relative', margin : '0 auto', top : 30, width : '100%', height : 20}}>
					<div style={{width : '100%', display : 'table'}}>
						<div style={{display : 'table-row'}}>
							<div style={{display : 'table-cell', textAlign : 'center'}}>Low</div>
							{
								['blue', 'orange', 'red'].map((c) => 
									<div key={c} style={_.extend({}, styles.cell, {color : c, backgroundColor : c})}>
									</div>
								)
							}
							<div style={{display : 'table-cell', textAlign : 'center'}}>High</div>
						</div>
					</div>
				</div>*/}

				{
				/*
				<div style={{position : 'relative', paddingLeft : 30, 'top' : 30}}>
					<p style={{fontSize : 25}}>Data Need</p>
				</div>

				<div style={{position : 'relative', margin : '0 auto', top : 30, width : '100%', height : 20}}>
					<div style={{width : '100%', display : 'table'}}>
						<div style={{display : 'table-row'}}>
							<div style={{display : 'table-cell', textAlign : 'center'}}>Low</div>
							{
								['red', 'blue', 'green'].map((c) => 
									<div key={c} style={_.extend({}, styles.cell, {color : c, backgroundColor : c})}>
									</div>
								)
							}
							<div style={{display : 'table-cell', textAlign : 'center'}}>High</div>
						</div>
					</div>
				</div>

				<div style={{position : 'absolute', paddingLeft : 30, bottom : 20}}>
					<p style={styles.label}>ATLAS</p>
				</div>
				*/
				}

			</div>
		)
	}
}

const styles = {
	cell : {
			height : 40,
			width : 40,
//			display : 'table-cell',
			opacity : 0.5,
		}
}