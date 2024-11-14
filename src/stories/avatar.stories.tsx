import { Meta, StoryObj } from "@storybook/react"

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"

const meta: Meta<typeof Avatar> = {
  title: "components/Avatar*",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Base: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="src/assets/icons/empty.svg" />
      <AvatarFallback>TIHLDE</AvatarFallback>
    </Avatar>
  ),
  args: {},
}
