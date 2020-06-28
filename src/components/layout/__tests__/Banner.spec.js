import React from 'react';
import {render} from '../../../test-utils';
import Banner from '../Banner';

test('Banner should contain title', () => {
  const {getByText} = render(<Banner title='title' />);

  expect(getByText('title')).toBeInTheDocument();
});

test('Banner should contain text', () => {
  const {getByText} = render(<Banner title='title' text='subtitle' />);

  expect(getByText('subtitle')).toBeInTheDocument();
});

test('Banner should contain button', () => {
  const {getByText} = render(<Banner title='title'><button>Button</button></Banner>);

  expect(getByText('Button')).toBeInTheDocument();
});
