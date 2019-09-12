import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { App } from '..';

describe('<App />', () => {
  it('renders and displays properly', () => {
    const wrapper = shallow(<App />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
