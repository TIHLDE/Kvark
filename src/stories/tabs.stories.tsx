import { Meta, StoryObj } from "@storybook/react"

import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof Tabs>

export const Base: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Konto</TabsTrigger>
        <TabsTrigger value="password">Passord</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Endre profilen din her. Trykk lagre når du er ferdig.
        </p>
        <div className="grid gap-2 py-4">
          <div className="space-y-1">
            <Label htmlFor="name">Navn</Label>
            <Input defaultValue="Pedro Duarte" id="name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Brukernavn</Label>
            <Input defaultValue="@peduarte" id="username" />
          </div>
        </div>
        <div className="flex">
          <Button>Lagre endringer</Button>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Endre passordet ditt her
        </p>
        <div className="grid gap-2 py-4">
          <div className="space-y-1">
            <Label htmlFor="current">Nåværende passord</Label>
            <Input id="current" type="password" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">Nytt passord</Label>
            <Input id="new" type="password" />
          </div>
        </div>
        <div className="flex">
          <Button>Lagre passord</Button>
        </div>
      </TabsContent>
    </Tabs>
  ),
  args: {
    defaultValue: "account",
  },
}
