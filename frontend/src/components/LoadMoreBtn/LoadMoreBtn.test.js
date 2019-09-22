import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { defaultOnSMTH } from '../../utils';
import { waitAndUpdateWrapper } from '../../testUtils';

import { LoadMoreBtn } from '.';

describe('<LoadMoreBtn />', () => {
  it('renders and displays properly', async () => {
    const wrapper = mount(
      <LoadMoreBtn displayedItemsCount={1} allItemsCount={2} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('has correct default props', () => {
    const wrapper = mount(<LoadMoreBtn />);

    const { allItemsCount, displayedItemsCount, onClick } = wrapper.props();
    expect(displayedItemsCount).toEqual(0);
    expect(allItemsCount).toEqual(0);
    expect(onClick).toEqual(defaultOnSMTH);
  });

  it('is hidden with default props', () => {
    const wrapper = mount(<LoadMoreBtn />);
    expect(wrapper.html()).toEqual(null);
  });

  it('sets correct visible state', async () => {
    // not visible
    const wrapper = mount(<LoadMoreBtn />);
    expect(wrapper.html()).toBeFalsy();

    // visible
    wrapper.setProps({
      displayedItemsCount: 1,
      allItemsCount: 2
    });
    await waitAndUpdateWrapper(wrapper);
    expect(wrapper.html()).toBeTruthy();

    // not visible
    wrapper.setProps({
      displayedItemsCount: 2,
      allItemsCount: 1
    });
    await waitAndUpdateWrapper(wrapper);
    expect(wrapper.html()).toBeFalsy();
  });

  it('should call onClick callback and change loading state', async () => {
    const onClick = jest.fn(async () => {
      await wait(100);
    });

    const wrapper = mount(
      <LoadMoreBtn
        displayedItemsCount={1}
        allItemsCount={2}
        onClick={onClick}
      />
    );
    const getBtn = () => wrapper.find('button');
    const getSpinner = () => wrapper.find('[data-test="spinner"]');

    const btn = getBtn();

    // there is button and no spinner
    // btn is not disabled
    expect(btn.exists()).toBeTruthy();
    expect(btn.props().disabled).toBeFalsy();
    expect(getSpinner().exists()).toBeFalsy();

    // click
    btn.simulate('click');

    // loading spinner dispalyed
    // btn is disabled
    await waitAndUpdateWrapper(wrapper);
    const displayedSpinner = getSpinner();
    const disabledBtn = getBtn();
    expect(displayedSpinner.exists()).toBeTruthy();
    expect(disabledBtn.props().disabled).toBeTruthy();

    // loading spinner is hidden
    // btn is enabled
    await waitAndUpdateWrapper(wrapper, 1000);
    const enabledBtn = getBtn();
    const hiddenSpinner = getSpinner();
    expect(enabledBtn.props().disabled).toBeFalsy();
    expect(hiddenSpinner.exists()).toBeFalsy();
  });
});
