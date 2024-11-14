import { Meta, StoryObj } from '@storybook/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'components/ui/accordion';

const meta: Meta<typeof Accordion> = {
  title: 'components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Base: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value='item-1'>
        <AccordionTrigger>Har du spørsmål?</AccordionTrigger>
        <AccordionContent>Det var dumt:/</AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-2'>
        <AccordionTrigger>Hvor er innholdet?</AccordionTrigger>
        <AccordionContent>Her er innholdet</AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-3'>
        <AccordionTrigger>Jeg trenger mer innhold?</AccordionTrigger>
        <AccordionContent>Her er mer innhold.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  args: {
    type: 'single',
    collapsible: true,
  },
};
