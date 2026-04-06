import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { JobDetail } from '@tihlde/sdk';
import DateTimePicker from '~/components/inputs/DateTimePicker';
import MarkdownEditor from '~/components/inputs/MarkdownEditor';
import { FormImageUpload } from '~/components/inputs/Upload';
import RendererPreview from '~/components/miscellaneous/RendererPreview';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { getJobByIdQuery, createJobMutation, updateJobMutation, deleteJobMutation } from '~/api/queries/jobs';
import JobPostRenderer from '~/routes/jobs/-components/JobPostRenderer';
import { JOB_TYPE_LABELS } from '~/routes/jobs/-components/job-labels';
import { parseISO } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import DeleteJobPost from './DeleteJobPost';
import JobPostFormSkeleton from './JobPostFormSkeleton';

type ClassValue = 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'alumni';
type JobType = 'full_time' | 'part_time' | 'summer_job' | 'other';

const CLASS_OPTIONS: { value: ClassValue; label: string }[] = [
  { value: 'first', label: '1' },
  { value: 'second', label: '2' },
  { value: 'third', label: '3' },
  { value: 'fourth', label: '4' },
  { value: 'fifth', label: '5' },
];

const JOB_TYPE_OPTIONS = Object.entries(JOB_TYPE_LABELS).map(([value, label]) => ({
  value: value as JobType,
  label,
}));

const CLASS_VALUES = ['first', 'second', 'third', 'fourth', 'fifth', 'alumni'] as const;
const JOB_TYPE_VALUES = ['full_time', 'part_time', 'summer_job', 'other'] as const;

export type EventEditorProps = {
  jobpostId: number | null;
  goToJobPost: (newJobPost: number | null) => void;
};

const formSchema = z
  .object({
    body: z.string().min(1, { error: 'Gi annonsen en beskrivelse' }),
    company: z.string().min(1, { error: 'Du må oppgi en bedrift' }),
    email: z.email({ error: 'Ugyldig e-post' }).optional().or(z.literal('')),
    ingress: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
    link: z.url({ error: 'Ugyldig URL' }).optional().or(z.literal('')),
    location: z.string(),
    title: z.string().min(1, { error: 'En tittel er påkrevd' }),
    isContinuouslyHiring: z.boolean(),
    jobType: z.enum(JOB_TYPE_VALUES),
    classStart: z.enum(CLASS_VALUES),
    classEnd: z.enum(CLASS_VALUES),
    deadline: z.date(),
  })
  .refine(
    (data) => {
      const order = CLASS_VALUES;
      return order.indexOf(data.classStart) <= order.indexOf(data.classEnd);
    },
    {
      path: ['classStart'],
      error: '"Fra arstrinn" ma vaere mindre eller lik "Til arstrinn"',
    },
  );

function getEmptyFormValues() {
  return {
    body: '',
    company: '',
    deadline: new Date(),
    email: '',
    imageUrl: '',
    imageAlt: '',
    ingress: '',
    isContinuouslyHiring: false,
    link: '',
    location: '',
    title: '',
    jobType: 'other' as const,
    classStart: 'first' as const,
    classEnd: 'fifth' as const,
  };
}

const JobPostEditor = ({ jobpostId, goToJobPost }: EventEditorProps) => {
  const { data, isLoading, isError } = useQuery({
    ...getJobByIdQuery(jobpostId?.toString() || '-1'),
    enabled: !!jobpostId && jobpostId !== -1,
  });
  const createJob = useMutation(createJobMutation);
  const updateJob = useMutation(updateJobMutation);
  const deleteJob = useMutation(deleteJobMutation);
  const isUpdating = createJob.isPending || updateJob.isPending || deleteJob.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getEmptyFormValues(),
  });

  useEffect(() => {
    if (isError) goToJobPost(null);
  }, [isError, goToJobPost]);

  useEffect(() => {
    if (data) {
      form.reset({
        body: data.body || '',
        company: data.company || '',
        deadline: data.deadline ? parseISO(data.deadline) : new Date(),
        email: data.email || '',
        imageUrl: data.imageUrl || '',
        imageAlt: data.imageAlt || '',
        ingress: data.ingress || '',
        isContinuouslyHiring: data.isContinuouslyHiring || false,
        link: data.link || '',
        location: data.location || '',
        title: data.title || '',
        jobType: data.jobType || 'other',
        classStart: data.classStart || 'first',
        classEnd: data.classEnd || 'fifth',
      });
    } else {
      form.reset(getEmptyFormValues());
    }
  }, [data, form.reset]);

  const getJobPostPreview = (): JobDetail | null => {
    const title = form.getValues('title');
    const company = form.getValues('company');
    const location = form.getValues('location');
    const body = form.getValues('body');

    if (!title && !company && !location && !body) {
      return null;
    }

    return {
      ...form.getValues(),
      id: '0',
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      deadline: form.getValues().deadline.toJSON(),
      expired: false,
      link: form.getValues('link') || null,
      email: form.getValues('email') || null,
      imageUrl: form.getValues('imageUrl') || null,
      imageAlt: form.getValues('imageAlt') || null,
      createdById: null,
      creator: null,
    };
  };

  const remove = async () => {
    if (!jobpostId) return;
    deleteJob.mutate(
      { jobId: jobpostId.toString() },
      {
        onSuccess: () => {
          toast.success('Stillingen ble slettet');
          goToJobPost(null);
        },
        onError: (e) => {
          toast.error(e.message);
        },
      },
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      title: values.title,
      ingress: values.ingress,
      body: values.body,
      company: values.company,
      location: values.location,
      deadline: values.deadline.toJSON(),
      isContinuouslyHiring: values.isContinuouslyHiring,
      jobType: values.jobType,
      classStart: values.classStart,
      classEnd: values.classEnd,
      email: values.email || undefined,
      link: values.link || undefined,
      imageUrl: values.imageUrl || undefined,
      imageAlt: values.imageAlt || undefined,
    };

    if (jobpostId) {
      updateJob.mutate(
        { jobId: jobpostId.toString(), data: payload },
        {
          onSuccess: () => {
            toast.success('Annonsen ble oppdatert');
          },
          onError: (e) => {
            toast.error(e.message);
          },
        },
      );
    } else {
      createJob.mutate(
        { data: payload },
        {
          onSuccess: (newJobPost) => {
            toast.success('Annonsen ble opprettet');
            goToJobPost(Number(newJobPost.id));
          },
          onError: (e) => {
            toast.error(e.message);
          },
        },
      );
    }
  };

  if (isLoading && jobpostId) {
    return <JobPostFormSkeleton />;
  }

  return (
    <Card>
      <CardContent className='py-6'>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Tittel <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Sted <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='ingress'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Ingress</FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MarkdownEditor form={form} label='Innhold' name='body' required />

            <FormField
              control={form.control}
              name='isContinuouslyHiring'
              render={({ field }) => (
                <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Fortlopende opptak?</FormLabel>
                    <FormDescription>Huk av om annonsen er fortlopende opptak.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <DateTimePicker form={form} label='Utlopsdato' name='deadline' required />

              <FormField
                control={form.control}
                name='link'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormImageUpload form={form} label='Velg logo' name='imageUrl' ratio='21:9' />

            <FormField
              control={form.control}
              name='imageAlt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternativ bildetekst</FormLabel>
                  <FormControl>
                    <Input placeholder='Skriv her...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <FormField
                control={form.control}
                name='company'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>
                      Bedrift <span className='text-red-300'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>E-post</FormLabel>
                    <FormControl>
                      <Input placeholder='Skriv her...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <div className='w-full flex space-x-4'>
                <FormField
                  control={form.control}
                  name='classStart'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Fra arstrinn</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CLASS_OPTIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='classEnd'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Til arstrinn</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CLASS_OPTIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='jobType'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Stillingstype</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPE_OPTIONS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-2 md:flex md:items-center md:justify-end md:space-x-4 md:space-y-0 pt-6'>
              <DeleteJobPost deleteJobPost={remove} jobPostId={jobpostId} />

              <RendererPreview getContent={getJobPostPreview} renderer={JobPostRenderer} />

              <Button className='w-full md:w-40 block' disabled={isUpdating} type='submit'>
                {jobpostId ? 'Oppdater annonse' : 'Opprett annonse'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JobPostEditor;
