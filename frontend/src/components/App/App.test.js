import React from 'react';
import { shallow } from 'enzyme';
import { ApolloClient } from 'apollo-client';
import toJSON from 'enzyme-to-json';

import { App as WrappedAppComponent } from '.';
import { App as AppComponent } from './App';

describe('<App />', () => {
  // /App/index exports Component decorated with HOC
  // so we test here actually two components: wrapped one and not wrapped
  const finalWrapper = shallow(<WrappedAppComponent />);
  const wrapper = shallow(<AppComponent />);

  it('renders and displays properly', () => {
    expect(toJSON(finalWrapper)).toMatchSnapshot();
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should be wrapped in configured ApolloProvider', () => {
    const ApolloProvider = finalWrapper.find('ApolloProvider');
    expect(ApolloProvider).toHaveLength(1);

    const { client } = ApolloProvider.props();
    expect(client).toBeInstanceOf(ApolloClient);
  });

  it('should be wrapped in AppContextProvider and render all necessary elements', () => {
    const AppContextProvider = wrapper.find('FinalAppContextProvider');
    const CssBaseline = wrapper.find('CssBaseline');
    const SearchAppBar = wrapper.find('SearchAppBar');
    const CreateCategoryForm = wrapper.find('CreateCategoryForm');
    const CreateWordForm = wrapper.find('CreateWordForm');
    const CategoriesList = wrapper.find('CategoriesList');
    const CategoryContent = wrapper.find('CategoryContent');

    expect(AppContextProvider).toHaveLength(1);
    expect(CssBaseline).toHaveLength(1);
    expect(SearchAppBar).toHaveLength(1);
    expect(CreateCategoryForm).toHaveLength(1);
    expect(CreateWordForm).toHaveLength(1);
    expect(CategoriesList).toHaveLength(1);
    expect(CategoryContent).toHaveLength(1);
  });

  it('All Grid elements should have proper breackpoints', () => {
    const containerBlock = { container: true, spacing: 2 };
    const narrowBlock = { item: true, xs: 12, sm: 5, md: 4 };
    const wideBlock = { item: true, xs: 12, sm: 7, md: 8 };

    const container = wrapper.find('[data-test="gr-container"]');
    expect(container.props()).toMatchObject(containerBlock);

    const categoryForm = wrapper.find('[data-test="gr-categoryForm"]');
    const categoryList = wrapper.find('[data-test="gr-categoryList"]');
    expect(categoryForm.props()).toMatchObject(narrowBlock);
    expect(categoryList.props()).toMatchObject(narrowBlock);

    const wordForm = wrapper.find('[data-test="gr-wordForm"]');
    const categoryContent = wrapper.find('[data-test="gr-categoryContent"]');
    expect(wordForm.props()).toMatchObject(wideBlock);
    expect(categoryContent.props()).toMatchObject(wideBlock);
  });
});
