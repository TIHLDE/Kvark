import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { z } from 'zod';

const formSchema = z.object({
  textInput: z.string().min(1, { message: 'Text input is required' }),
  numberInput: z.coerce.number().transform((val) => Number(val)),
  emailInput: z.string().email({ message: 'Invalid email address' }),
  passwordInput: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  textareaInput: z.string().min(1, { message: 'Textarea is required' }),
  switchToggle: z.boolean(),
  dateTimeField: z.date(),
  selectField: z.string().min(1, { message: 'Please select an option' }),
  userField: z.string().optional(),
  multiUserField: z.array(z.string()),
  multiCheckboxField: z.array(z.string()),
  imageUpload: z.string(),
  fileUpload: z.string(),
  boolExpand: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const sampleData: FormData = {
  textInput: 'Sample text input',
  numberInput: 42,
  emailInput: 'test@example.com',
  passwordInput: 'secretpassword123',
  textareaInput: 'This is a sample textarea content with multiple lines.\nIt demonstrates how the component handles longer text.',
  switchToggle: true,
  dateTimeField: new Date(),
  selectField: 'option2',
  userField: 'user123',
  multiUserField: ['user123', 'user456'],
  multiCheckboxField: ['option1', 'option3'],
  imageUpload: '',
  fileUpload: '',
  boolExpand: false,
};

const selectOptions = [
  { value: 'option1', content: 'First Option' },
  { value: 'option2', content: 'Second Option' },
  { value: 'option3', content: 'Third Option' },
];

const checkboxItems = [
  { value: 'option1', label: 'Checkbox Option 1' },
  { value: 'option2', label: 'Checkbox Option 2' },
  { value: 'option3', label: 'Checkbox Option 3' },
  { value: 'option4', label: 'Checkbox Option 4' },
];

function FormTestPage() {
  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      textInput: '',
      numberInput: 0,
      emailInput: '',
      passwordInput: '',
      textareaInput: '',
      switchToggle: false,
      dateTimeField: new Date(),
      selectField: '',
      userField: '',
      multiUserField: [],
      multiCheckboxField: [],
      imageUpload: '',
      fileUpload: '',
      boolExpand: false,
    } as FormData,
    async onSubmit({ value }) {
      // eslint-disable-next-line no-console
      console.log('Form submitted:', value);
      alert('Form submitted! Check the console for details.');
    },
  });

  const fillWithSampleData = () => {
    Object.entries(sampleData).forEach(([key, value]) => {
      form.setFieldValue(key as keyof FormData, value);
    });
  };

  const clearForm = () => {
    form.reset();
  };

  return (
    <Page>
      <div className='container mx-auto py-8 space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Form Components Test Page</h1>
          <p className='text-muted-foreground'>This page demonstrates all available form components from AppForm.tsx</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Test all form input components with various configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
                {/* Text Inputs */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Text Inputs</h3>

                  <form.AppField name='textInput'>
                    {(field) => <field.InputField label='Text Input' description='Basic text input field' placeholder='Enter some text...' required />}
                  </form.AppField>

                  <form.AppField name='numberInput'>
                    {(field) => <field.InputField type='number' label='Number Input' description='Numeric input field' placeholder='Enter a number...' />}
                  </form.AppField>

                  <form.AppField name='emailInput'>
                    {(field) => <field.InputField type='email' label='Email Input' description='Email validation input' placeholder='Enter your email...' />}
                  </form.AppField>

                  <form.AppField name='passwordInput'>
                    {(field) => <field.InputField type='password' label='Password Input' description='Password input field' placeholder='Enter password...' />}
                  </form.AppField>

                  <form.AppField name='textareaInput'>
                    {(field) => <field.TextareaField label='Textarea' description='Multi-line text input' placeholder='Enter longer text here...' rows={4} />}
                  </form.AppField>
                </div>

                <Separator />

                {/* Toggle and Selection */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Toggle & Selection</h3>

                  <form.AppField name='switchToggle'>
                    {(field) => <field.SwitchField label='Switch Toggle' description='Boolean toggle switch' />}
                  </form.AppField>

                  <form.AppField name='boolExpand'>
                    {(field) => (
                      <field.BoolExpand title='Expandable Section' description='Toggle to expand additional content'>
                        <p className='text-sm text-muted-foreground'>
                          This content is shown when the expandable section is opened. You can put any form fields or content here.
                        </p>
                      </field.BoolExpand>
                    )}
                  </form.AppField>

                  <form.AppField name='selectField'>
                    {(field) => (
                      <field.SelectField
                        label='Select Field'
                        description='Single selection dropdown'
                        placeholder='Choose an option...'
                        options={selectOptions}
                        required
                      />
                    )}
                  </form.AppField>

                  <form.AppField name='multiCheckboxField'>
                    {(field) => <field.MultiCheckboxField label='Multi Checkbox' description='Multiple selection checkboxes' items={checkboxItems} />}
                  </form.AppField>
                </div>

                <Separator />

                {/* Date and User */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Date & User Selection</h3>

                  <form.AppField name='dateTimeField'>{(field) => <field.DateTimeField label='Date Time' description='Date and time picker' />}</form.AppField>

                  <form.AppField name='userField'>
                    {(field) => <field.UserField label='User Field' description='User selection field' placeholder='Select a user...' />}
                  </form.AppField>
                  <form.AppField name='multiUserField'>
                    {(field) => <field.UserField multiple label='User Field' description='Multi User selection field' placeholder='Select users...' />}
                  </form.AppField>
                </div>

                <Separator />

                {/* File Uploads */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>File Uploads</h3>

                  {/* <form.AppField name='imageUpload'>{(field) => <field.ImageUploadField label='Image Upload' description='Upload image files' />}</form.AppField> */}

                  {/* <form.AppField name='fileUpload'>{(field) => <field.FileUploadField label='File Upload' description='Upload any file type' />}</form.AppField> */}
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-4'>
                  <form.AppForm>
                    <form.SubmitButton className='flex-1'>Submit Form</form.SubmitButton>
                  </form.AppForm>

                  <Button type='button' variant='outline' onClick={fillWithSampleData} className='flex-1'>
                    Fill with Sample Data
                  </Button>

                  <Button type='button' variant='secondary' onClick={clearForm} className='flex-1'>
                    Clear Form
                  </Button>
                </div>

                {/* Form Errors */}
                <form.AppForm>
                  <form.FormErrors />
                </form.AppForm>
              </form>
            </CardContent>
          </Card>

          {/* JSON Display Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Data (Live)</CardTitle>
              <CardDescription>Real-time display of current form state as JSON</CardDescription>
            </CardHeader>
            <CardContent className='h-full'>
              <form.Subscribe selector={(state) => state.values}>
                {(values) => (
                  <pre className='sticky top-20  left-0 bg-muted p-4 rounded-md text-sm overflow-auto max-h-[600px] whitespace-pre-wrap'>
                    {JSON.stringify(values, null, 2)}
                  </pre>
                )}
              </form.Subscribe>
            </CardContent>
          </Card>
        </div>

        {/* Form State Information */}
        <Card>
          <CardHeader>
            <CardTitle>Form State Information</CardTitle>
            <CardDescription>Current form validation state and submission status</CardDescription>
          </CardHeader>
          <CardContent>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}>
              {([canSubmit, isSubmitting, errors]) => (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                  <div className='p-3 bg-muted rounded'>
                    <strong>Can Submit:</strong> {canSubmit ? '✅ Yes' : '❌ No'}
                  </div>
                  <div className='p-3 bg-muted rounded'>
                    <strong>Is Submitting:</strong> {isSubmitting ? '⏳ Yes' : '✅ No'}
                  </div>
                  <div className='p-3 bg-muted rounded'>
                    <strong>Errors:</strong> {Array.isArray(errors) && errors.length > 0 ? `❌ ${errors.length}` : '✅ None'}
                  </div>
                </div>
              )}
            </form.Subscribe>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}

export default FormTestPage;
