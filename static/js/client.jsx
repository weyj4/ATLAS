import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory, IndexRedirect} from 'react-router';

import Layout from './Layout';
import Main from './pages/Main';

import 'react-select/dist/react-select.css';

const app = document.getElementById('app');

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRedirect to="/main"/>
			<Route path="main" component={Main}/>
			<Route path="settings" component={Main}/>
		</Route>
	</Router>,
	app
);
