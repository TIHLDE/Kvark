import type { Meta, StoryObj } from '@storybook/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { FormFieldType } from 'types/Enums';

import FieldEditor from './FieldEditor';

const meta: Meta<typeof FieldEditor> = {
  component: FieldEditor,
  title: 'Forms/FieldEditor',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DndProvider backend={HTML5Backend}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Story />
        </div>
      </DndProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FieldEditor>;

export const TextFieldEditor: Story = {
  args: {
    index: 0,
    field: {
      order: 0,
      options: [
        { id: '1', title: 'Red' },
        { id: '2', title: 'Blue' },
        { id: '3', title: 'Green' },
      ],
      id: '1',
      title: 'What is your favorite color?',
      type: FormFieldType.TEXT_ANSWER,
      required: true,
    },
    updateField: () => {},
    moveField: () => {},
    removeField: () => {},
  },
};

export const SingleSelectFieldEditor: Story = {
  args: {
    index: 1,
    field: {
      order: 1,
      id: '2',
      title: 'What is your favorite color?',
      type: FormFieldType.SINGLE_SELECT,
      required: false,
      options: [
        { id: '1', title: 'Red' },
        { id: '2', title: 'Blue' },
        { id: '3', title: 'Green' },
      ],
    },
    updateField: () => {},
    moveField: () => {},
    removeField: () => {},
  },
};

export const MultipleSelectFieldEditor: Story = {
  args: {
    index: 2,
    field: {
      order: 2,

      id: '3',
      title: 'What technologies do you use?',
      type: FormFieldType.MULTIPLE_SELECT,
      required: true,
      options: [
        { id: '1', title: 'React' },
        { id: '2', title: 'Vue' },
        { id: '3', title: 'Angular' },
        { id: '4', title: 'Svelte' },
      ],
    },
    updateField: () => {},
    moveField: () => {},
    removeField: () => {},
  },
};

export const DisabledFieldEditor: Story = {
  args: {
    index: 3,
    field: {
      id: '4',
      title: 'This field is disabled',
      type: FormFieldType.TEXT_ANSWER,
      required: false,
      options: [
        { id: '1', title: 'Red' },
        { id: '2', title: 'Blue' },
        { id: '3', title: 'Green' },
      ],
      order: 3,
    },
    updateField: () => {},
    moveField: () => {},
    removeField: () => {},
    disabled: true,
  },
};
