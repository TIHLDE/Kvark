
import { Input } from "components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent } from "components/ui/select";
import { FormLabel,  FormItem, Form,  } from "components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "components/ui/button";

export default function NewGroupAdministration() {
    const form = useForm();

  return <div className="max-w-5xl mx-auto pt-24 flex flex-col gap-2 px-2">
    <h1 className="text-4xl font-bold">Opprett ny gruppe</h1>
    <p className="text-muted-foreground mb-8">Velg gruppetype og opprett en ny gruppe.</p>
    <Form {...form}>

    <form onSubmit={()=>{}}>
    <FormItem className="mb-5">
        <FormLabel>Gruppenavn</FormLabel>
            <Input placeholder="Gruppenavn" />
    </FormItem>
    <FormItem style={{ marginBottom: '20px' }}>
        <FormLabel>Slug</FormLabel>
            <Input placeholder="Slug" />
            <p className="text-muted-foreground mb-8 text-sm">
              En slug er en kort tekststreng som brukes i URL-adresser for å identifisere en spesifikk ressurs på en webside
              </p>
    </FormItem>
    <FormItem className = "mb-5">
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
    <FormItem className="mb-5">
      <Button
        variant="default"
      >
        Opprett Gruppe
      </Button>
    </FormItem>
    </form>
    </Form>
  </div>;
}