import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { WordContent } from '.';

const mockedWord = {
  content: 'word',
  id: 'unoquie',
  createdAt: '2019-09-11T21:13:39.695Z'
};

describe('<WordContent />', () => {
  it('renders and displays properly', () => {
    const wrapper = shallow(<WordContent data={mockedWord} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
