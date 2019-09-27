import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import toJSON from 'enzyme-to-json';

import { fakeWord } from '../../testUtils';

import { WordContent } from '.';

// TODO: complete tests
describe('<WordContent />', () => {
  it('renders and displays properly', () => {
    const wrapper = mount(
      <MockedProvider>
        <WordContent data={fakeWord()} />
      </MockedProvider>
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
