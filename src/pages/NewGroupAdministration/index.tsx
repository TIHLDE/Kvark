
import { Input } from "components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent } from "components/ui/select";
import { FormLabel,  FormItem, Form,  } from "components/ui/form";
import { useForm } from "react-hook-form";

export default function NewGroupAdministration() {
    const form = useForm();

  return <div className="max-w-5xl mx-auto pt-24 flex flex-col gap-2 px-2  ">
    <h1 className="text-4xl font-bold">Opprett ny gruppe</h1>
    <p className="text-muted-foreground mb-8">Velg gruppetype og opprett en ny gruppe.</p>
    <Form {...form}>

    <form onSubmit={()=>{}}>
    <FormItem>
        <FormLabel>Gruppenavn</FormLabel>
            <Input placeholder="Gruppenavn" />
    </FormItem>
    <FormItem>
        <FormLabel>Slug</FormLabel>
            <Input placeholder="Slug" />
    </FormItem>
    <FormItem>
      <FormLabel>Gruppetype</FormLabel>
        <Select>
          <SelectTrigger className="text-muted-foreground">Velg gruppetype...</SelectTrigger>
          <SelectContent>
      <SelectItem value="board">Styre</SelectItem>
      <SelectItem value="subGroup">Undergruppe</SelectItem>
      <SelectItem value="committee">Komité</SelectItem>
      <SelectItem value="interestGroup">Interesse Gruppe</SelectItem>
      </SelectContent>
    </Select>
    </FormItem>
    </form>
    </Form>
  </div>;
}