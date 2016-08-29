import React from 'react';
import {Row, Col} from 'react-bootstrap'
var _ = require('underscore');
import Select from 'react-select';

export default class RiskMenu extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			diseases : [{label : 'Dengue', value : 'dengue'}, {label : 'Zika', value : 'zika'}],
			selectedDisease : undefined,
		}
	}

	changeDisease = (disease) => {
		this.setState(_.extend({}, this.state, {
			selectedDisease : disease
		}))
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
					<p style={{fontSize : 25}}>{this.state.selectedDisease ? this.state.selectedDisease.label : undefined}</p>
					
				</div>

				<div style={{display : 'table', position : 'relative', top : 30, margin : '0 auto', width : '100%', height : 20}}>
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

				<div style={{height : 30}}/>

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

			</div>
		)
	}
}

const styles = {
	cell : {
			height : 20,
			width : '20%',
			display : 'table-cell',
			opacity : 0.5,
		}
}