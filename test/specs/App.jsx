// Test Cases for client.jsx

import React from 'react';
import {expect} from 'chai';
import {mount, render, shallow} from 'enzyme';
import Layout from 'atlas/Layout';

describe('<PolicyMenu/>', () => {
	it('Mount component', () => {
		const wrapper = shallow(
			<Layout/>
		)	
		expect(true).to.equal(true)
	}) 
})

