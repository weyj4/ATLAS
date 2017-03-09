import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, browserHistory, IndexRedirect} from 'react-router';

import Layout from 'atlas/Layout';
import Main from 'atlas/pages/Main';
import LandingPage from 'atlas/pages/LandingPage';

import 'react-select/dist/react-select.css';

const app = document.getElementById('app');

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={Layout}>
			<IndexRedirect to="/landing-page"/>
			<Route path="landing-page" component={LandingPage}/>
			<Route path="main" component={Main}/>
			<Route path="settings" component={Main}/>
		</Route>
	</Router>,
	app
);
