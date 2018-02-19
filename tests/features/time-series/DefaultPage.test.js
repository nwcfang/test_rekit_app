import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/time-series/DefaultPage';

describe('time-series/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      timeSeries: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.time-series-default-page').getElement()
    ).to.exist;
  });
});
