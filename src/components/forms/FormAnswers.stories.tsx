import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

// Define types for MSW parameters
type RequestParams = {
  params: Record<string, string>;
};

import { FormFieldType } from 'types/Enums';

import FormAnswers from './FormAnswers';

const meta: Meta<typeof FormAnswers> = {
  component: FormAnswers,
  title: 'Forms/FormAnswers',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('*/api/v1/forms/:formId/', ({ params }) => {
          return HttpResponse.json({
            id: 'form123',
            title: 'Sample Form',
            fields: [
              {
                id: 'field1',
                title: 'What is your name?',
                type: FormFieldType.TEXT_ANSWER,
                required: true,
              },
              {
                id: 'field2',
                title: 'What is your favorite color?',
                type: FormFieldType.SINGLE_SELECT,
                required: false,
                options: [
                  { id: 'opt1', title: 'Red' },
                  { id: 'opt2', title: 'Blue' },
                  { id: 'opt3', title: 'Green' },
                ],
              },
            ],
            resource_type: 'GENERAL_FORM',
          });
        }),
        http.get('*/api/v1/forms/:formId/submissions/', ({ params }) => {
          return HttpResponse.json({
            count: 2,
            next: null,
            previous: null,
            results: [
              {
                id: 'sub1',
                user: {
                  first_name: 'John',
                  last_name: 'Doe',
                  email: 'john.doe@example.com',
                  study: { group: { name: 'Data Science' } },
                  studyyear: { group: { name: '2022' } },
                },
                answers: [
                  {
                    field: { id: 'field1' },
                    answer_text: 'John Doe',
                  },
                  {
                    field: { id: 'field2' },
                    selected_options: [{ id: 'opt2' }],
                  },
                ],
              },
              {
                id: 'sub2',
                user: {
                  first_name: 'Jane',
                  last_name: 'Smith',
                  email: 'jane.smith@example.com',
                  study: { group: { name: 'Computer Science' } },
                  studyyear: { group: { name: '2021' } },
                },
                answers: [
                  {
                    field: { id: 'field1' },
                    answer_text: 'Jane Smith',
                  },
                  {
                    field: { id: 'field2' },
                    selected_options: [{ id: 'opt3' }],
                  },
                ],
              },
            ],
          });
        }),
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormAnswers>;

export const Default: Story = {
  args: {
    formId: 'form123',
  },
};

export const NoFormId: Story = {
  args: {
    formId: null,
  },
};
