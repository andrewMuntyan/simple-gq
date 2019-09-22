// TODO: complete tests

import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { AddEntityForm } from '.';

describe('<AddEntityForm />', () => {
  const wrapper = shallow(<AddEntityForm />);
  it('renders and displays properly', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
