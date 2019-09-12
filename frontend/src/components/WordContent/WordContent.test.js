import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { fakeWord } from '../../testUtils';

import { WordContent } from '.';

describe('<WordContent />', () => {
  it('renders and displays properly', () => {
    const wrapper = shallow(<WordContent data={fakeWord()} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
