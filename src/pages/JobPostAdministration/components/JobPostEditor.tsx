import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import RendererPreview from '~/components/miscellaneous/RendererPreview';
import { Card, CardContent } from '~/components/ui/card';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { useCreateJobPost, useDeleteJobPost, useJobPostById, useUpdateJobPost } from '~/hooks/JobPost';
import JobPostRenderer from '~/pages/JobPostDetails/components/JobPostRenderer';
import type { JobPost } from '~/types';
import { JobPostType } from '~/types/Enums';
import { getJobpostType } from '~/utils';
import { parseISO } from 'date-fns';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import DeleteJobPost from './DeleteJobPost';
import JobPostFormSkeleton from './JobPostFormSkeleton';

const years = [1, 2, 3, 4, 5];

export type EventEditorProps = {
  jobpostId: number | null;
  goToJobPost: (newJobPost: number | null) => void;
};

const formSchema = z
  .object({
    body: z.string().min(1, { message: 'Gi annonsen en beskrivelse' }),
    company: z.string().min(1, { message: 'Du må oppgi en bedrift' }),
    email: z.string().email({ message: 'Ugyldig e-post' }).optional().or(z.literal('')),
    ingress: z.string(),
    image: z.string(),
    image_alt: z.string(),
    link: z.string().url({ message: 'Ugyldig URL' }).optional().or(z.literal('')),
    location: z.string(),
    title: z.string().min(1, { message: 'En tittel er påkrevd' }),
    is_continuously_hiring: z.boolean(),
    job_type: z.nativeEnum(JobPostType),
    class_start: z.string(),
    class_end: z.string(),
    deadline: z.date(),
  })
  .refine((data) => parseInt(data.class_start) <= parseInt(data.class_end), {
    message: '"Fra årstrinn" må være mindre eller lik "Til årstrinn"',
    path: ['class_start'],
  });

type FormValues = z.infer<typeof formSchema>;

const JobPostEditor = ({ jobpostId, goToJobPost }: EventEditorProps) => {
  const { data, isLoading, isError } = useJobPostById(jobpostId || -1);
  const createJobPost = useCreateJobPost();
  const updateJobPost = useUpdateJobPost(jobpostId || -1);
  const deleteJobPost = useDeleteJobPost(jobpostId || -1);

  const form = useAppForm({
    validators: { onBlur: formSchema, onSubmit: formSchema },
    defaultValues: {
      body: data?.body ?? '',
      company: data?.company ?? '',
      deadline: data?.deadline ? parseISO(data.deadline) : new Date(),
      email: data?.email ?? '',
      image: data?.image ?? '',
      image_alt: data?.image_alt ?? '',
      ingress: data?.ingress ?? '',
      is_continuously_hiring: data?.is_continuously_hiring ?? false,
      link: data?.link ?? '',
      location: data?.location ?? '',
      title: data?.title ?? '',
      job_type: JobPostType.OTHER,
      class_start: years[0].toString(),
      class_end: years[years.length - 1].toString(),
    } as FormValues,
    async onSubmit({ value }) {
      if (jobpostId) {
        await updateJobPost.mutateAsync(
          { ...value, deadline: value.deadline.toJSON(), class_start: parseInt(value.class_start), class_end: parseInt(value.class_end) },
          {
            onSuccess: () => {
              toast.success('Annonsen ble oppdatert');
            },
            onError: (e) => {
              toast.error(e.detail);
            },
          },
        );
      } else {
        await createJobPost.mutateAsync(
          { ...value, deadline: value.deadline.toJSON(), class_start: parseInt(value.class_start), class_end: parseInt(value.class_end) },
          {
            onSuccess: (newJobPost) => {
              toast.success('Annonsen ble opprettet');
              goToJobPost(newJobPost.id);
            },
            onError: (e) => {
              toast.error('Kunne ikke lage job annonse: ' + (e.detail ?? 'Noe gikk galt'));
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    if (isError) goToJobPost(null);
  }, [isError, goToJobPost]);

  useEffect(() => {
    form.reset();
  }, [data, form]);

  const getJobPostPreview = (): JobPost | null => {
    const { title, company, location, body } = form.state.values as FormValues;

    if (!title && !company && !location && !body) {
      return null;
    }

    const values = form.state.values as FormValues;
    return {
      ...values,
      created_at: new Date().toJSON(),
      id: 1,
      expired: false,
      updated_at: new Date().toJSON(),
      deadline: values.deadline.toJSON(),
      class_start: parseInt(values.class_start),
      class_end: parseInt(values.class_end),
      link: values.link || '',
      email: values.email || '',
    };
  };

  const remove = async () => {
    deleteJobPost.mutate(null, {
      onSuccess: (data) => {
        toast.success(data.detail);
        goToJobPost(null);
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  if (isLoading) {
    return <JobPostFormSkeleton />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <form className='space-y-6' onSubmit={handleFormSubmit(form)}>
          <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
            <form.AppField name='title'>
              {(field) => (
                <FormItem className='w-full'>
                  <FormLabel>
                    Tittel <span className='text-red-300'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>

            <form.AppField name='location'>
              {(field) => (
                <FormItem className='w-full'>
                  <FormLabel>
                    Sted <span className='text-red-300'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>
          </div>

          <form.AppField name='ingress'>
            {(field) => (
              <FormItem className='w-full'>
                <FormLabel>Ingress</FormLabel>
                <FormControl>
                  <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>

          <form.AppField name='body'>{(field) => <field.TextareaField label='Innhold' required />}</form.AppField>

          <form.AppField name='is_continuously_hiring'>
            {(field) => (
              <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Fortløpende opptak?</FormLabel>
                  <FormDescription>Huk av om annonsen er fortløpende opptak.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={Boolean(field.state.value)} onCheckedChange={(v) => field.handleChange(Boolean(v))} />
                </FormControl>
              </FormItem>
            )}
          </form.AppField>

          <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
            <form.AppField name='deadline'>{(field) => <field.DateTimeField label='Utløpsdato' required />}</form.AppField>

            <form.AppField name='link'>
              {(field) => (
                <FormItem className='w-full'>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>
          </div>

          <form.AppField name='image'>{(field) => <field.ImageUploadField label='Velg logo' />}</form.AppField>

          <form.AppField name='image_alt'>
            {(field) => (
              <FormItem>
                <FormLabel>Alternativ bildetekst</FormLabel>
                <FormControl>
                  <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>

          <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
            <form.AppField name='company'>
              {(field) => (
                <FormItem className='w-full'>
                  <FormLabel>
                    Bedrift <span className='text-red-300'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>

            <form.AppField name='email'>
              {(field) => (
                <FormItem className='w-full'>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' value={String(field.state.value ?? '')} onChange={(e) => field.handleChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>
          </div>

          <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
            <div className='w-full flex space-x-4'>
              <form.AppField name='class_start'>
                {(field) => (
                  <FormItem className='w-full'>
                    <FormLabel>Fra årstrinn</FormLabel>
                    <Select defaultValue={String(field.state.value ?? '')} onValueChange={(v) => field.handleChange(v)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={String(field.state.value ?? '')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              </form.AppField>

              <form.AppField name='class_end'>
                {(field) => (
                  <FormItem className='w-full'>
                    <FormLabel>Til årstrinn</FormLabel>
                    <Select defaultValue={String(field.state.value ?? '')} onValueChange={(v) => field.handleChange(v)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={String(field.state.value ?? '')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              </form.AppField>
            </div>

            <form.AppField name='job_type'>
              {(field) => (
                <FormItem className='w-full'>
                  <FormLabel>Stillingstype</FormLabel>
                  <Select defaultValue={String(field.state.value ?? '')} onValueChange={(v) => field.handleChange(v as JobPostType)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={String(field.state.value ?? '')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(JobPostType) as Array<JobPostType>).map((value) => (
                        <SelectItem key={value} value={value}>
                          {getJobpostType(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>
          </div>

          <div className='space-y-2 md:flex md:items-center md:justify-end md:space-x-4 md:space-y-0 pt-6'>
            <DeleteJobPost deleteJobPost={remove} jobPostId={jobpostId} />

            <RendererPreview getContent={getJobPostPreview} renderer={JobPostRenderer} />
            <form.AppForm>
              <form.SubmitButton className='w-full md:w-40 block' type='submit'>
                {jobpostId ? 'Oppdater annonse' : 'Opprett annonse'}
              </form.SubmitButton>
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostEditor;
