import React from 'react'
import Map from 'atlas/components/Map';
import RiskMenu from 'atlas/components/RiskMenu'
import IndexBuilderStore from 'atlas/stores/IndexBuilderStore';
import * as IndexBuilderActions from 'atlas/actions/IndexBuilderActions';
import * as _ from 'underscore';
import IndexBuilder from 'atlas/components/IndexBuilder';

export default class Main extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			showIndexBuilder : IndexBuilderStore.getBuilderVisibility()
		}
	}

	updateBuilderVisibility = () => {
		this.setState(_.extend({}, this.state, {
			showIndexBuilder : IndexBuilderStore.getBuilderVisibility()
		}))
	}

	componentWillMount() {
		IndexBuilderStore.on('change-visibility', this.updateBuilderVisibility);
	}

    componentWillUnmount () {
    	IndexBuilderStore.removeListener('change-visibility', this.updateBuilderVisibility);
    }

	render(){
		return(
			<div style={styles.mapContainer}>
				<Map style={styles.map}/>
				<RiskMenu style={styles.riskMenu}/>
				{
					this.state.showIndexBuilder ? 
						<IndexBuilder/> : null
				}
			</div>	
		)
	}
}

const styles = {
	mapContainer : {
		height : '100%',
		width : '100%',
	},
	map : {
		width : '70%',
		height : '100%',
		position : 'relative'
	},
	riskMenu : {
		position : 'absolute',
		right : 0,
		width : '30%',
		top : 0,
		bottom : 0,
		zIndex : 1,
	},
}