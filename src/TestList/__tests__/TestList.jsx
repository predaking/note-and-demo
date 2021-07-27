import React from 'react';

import Enzyme, {
    shallow
} from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import TestList from '../index.jsx';

Enzyme.configure({
    adapter: new Adapter()
});

test('测试List组件', () => {
    const wrapper = shallow(
        <TestList />
    );
    // expect(wrapper.find('[data-test="list"]').length).toBe(1);
    expect(wrapper).toMatchSnapshot();
});

