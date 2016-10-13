import React from 'react';
import ZikaStore from 'atlas/stores/ZikaStore';
import * as ZikaActions from 'atlas/actions/ZikaActions';
import Select from 'react-select';

export default class ZikaMenu extends React.Component{
	constructor(){
		super();
		this.state = {
			dates : ZikaStore.getDates(),
			dateIndex : ZikaStore.getDateIndex(),
		}
	}

	updateDates = () => {
		this.setState(_.extend({}, this.state, {
			dates : ZikaStore.getDates()
		}))
	}

	updateDateIndex = () => {
		this.setState(_.extend({}, this.state, {
			dateIndex : ZikaStore.getDateIndex()
		}))
	}

	componentWillMount(){
		ZikaStore.on('change-dates', this.updateDates);
		ZikaStore.on('change-date-index', this.updateDateIndex);
	}

	componentWillUnmount(){
		ZikaStore.removeListener('change-dates', this.updateDates);
		ZikaStore.removeListener('change-date-index', this.updateDateIndex);
	}

	changeDate = (option) => {
		ZikaActions.changeDateIndex(option.value)
	}	

	render(){
		var date = this.state.dates[this.state.dateIndex];
		return(
			<div>
				<div style={{height : 50}}></div>
				<p style={{fontSize : 24}} class='text-center'>
					Choose Date
				</p>
				<div style={{width : '70%', margin : '0 auto'}}>
					<Select
						value={{value : this.state.dateIndex, label : date}}
						options={this.state.dates.map((d, i) => ({value : i, label : d}))}
						onChange={this.changeDate}
					/>
				</div>
			</div>
		)
	}
}