import FormAnswers from '~/components/forms/FormAnswers';
import FormDetailsEditor from '~/components/forms/FormDetailsEditor';
import FormFieldsEditor from '~/components/forms/FormFieldsEditor';
import FormStatistics from '~/components/forms/FormStatistics';
import FormUserStatistics from '~/components/forms/FormUserStatistics';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useFormById } from '~/hooks/Form';

export type FormAdminProps = {
  formId: string;
};

const FormAdmin = ({ formId }: FormAdminProps) => {
  const { data: form } = useFormById(formId);

  if (!form) {
    return null;
  }

  const tabs = [
    { label: 'Innstillinger', value: 'settings', component: <FormDetailsEditor form={form} /> },
    { label: 'Spørsmål', value: 'questions', component: <FormFieldsEditor form={form} /> },
    { label: 'Statistikk', value: 'stats', component: <FormStatistics formId={form.id} /> },
    { label: 'Innsenderstatistikk', value: 'user-stats', component: <FormUserStatistics formId={form.id} /> },
    { label: 'Alle svar', value: 'answers', component: <FormAnswers formId={form.id} /> },
  ];

  return (
    <Tabs defaultValue='settings'>
      <ScrollArea className='w-full whitespace-nowrap p-0 pb-3'>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FormAdmin;
