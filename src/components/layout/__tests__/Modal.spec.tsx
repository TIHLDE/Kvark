import React from 'react';
import { render } from '../../../test-utils';
import Modal from '../Modal';

test('Modal should contain header', () => {
  const { getByText } = render(
    <Modal header='header' onClose={() => {}} open={true}>
      <p></p>
    </Modal>,
  );

  expect(getByText('header')).toBeInTheDocument();
});

test('Modal should contain children', () => {
  const { getByText } = render(
    <Modal onClose={() => {}} open={true}>
      <p>Test text</p>
    </Modal>,
  );

  expect(getByText('Test text')).toBeInTheDocument();
});

test('Modal should have default close button text', () => {
  const { getByText } = render(
    <Modal onClose={() => {}} open={true}>
      <p></p>
    </Modal>,
  );

  expect(getByText('Lukk')).toBeInTheDocument();
});
test('Modal should have custom close button text', () => {
  const { getByText } = render(
    <Modal closeText='Cancel' onClose={() => {}} open={true}>
      <p></p>
    </Modal>,
  );

  expect(getByText('Cancel')).toBeInTheDocument();
});
