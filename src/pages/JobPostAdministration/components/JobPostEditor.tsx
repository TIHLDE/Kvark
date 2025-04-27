import { zodResolver } from '@hookform/resolvers/zod';
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
import { useCreateJobPost, useDeleteJobPost, useJobPostById, useUpdateJobPost } from '~/hooks/JobPost';
import JobPostRenderer from '~/pages/JobPostDetails/components/JobPostRenderer';
import type { JobPost } from '~/types';
import { JobPostType } from '~/types/Enums';
import { getJobpostType } from '~/utils';
import { parseISO } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
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

const JobPostEditor = ({ jobpostId, goToJobPost }: EventEditorProps) => {
  const { data, isLoading, isError } = useJobPostById(jobpostId || -1);
  const createJobPost = useCreateJobPost();
  const updateJobPost = useUpdateJobPost(jobpostId || -1);
  const deleteJobPost = useDeleteJobPost(jobpostId || -1);
  const isUpdating = useMemo(
    () => createJobPost.isPending || updateJobPost.isPending || deleteJobPost.isPending,
    [createJobPost.isPending, updateJobPost.isPending, deleteJobPost.isPending],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: '',
      company: '',
      deadline: new Date(),
      email: '',
      image: '',
      image_alt: '',
      ingress: '',
      is_continuously_hiring: false,
      link: '',
      location: '',
      title: '',
      job_type: JobPostType.OTHER,
      class_start: years[0].toString(),
      class_end: years[years.length - 1].toString(),
    },
  });

  useEffect(() => {
    !isError || goToJobPost(null);
  }, [isError]);

  const setValues = useCallback(
    (newValues: JobPost | null) => {
      form.reset({
        body: newValues?.body || '',
        company: newValues?.company || '',
        deadline: newValues?.deadline ? parseISO(newValues?.deadline) : new Date(),
        email: newValues?.email || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        ingress: newValues?.ingress || '',
        is_continuously_hiring: newValues?.is_continuously_hiring || false,
        link: newValues?.link || '',
        location: newValues?.location || '',
        title: newValues?.title || '',
        job_type: newValues?.job_type || JobPostType.OTHER,
        class_start: newValues?.class_start.toString() || years[0].toString(),
        class_end: newValues?.class_end.toString() || years[years.length - 1].toString(),
      });
    },
    [form.reset],
  );

  useEffect(() => {
    if (data) {
      setValues(data);
    } else {
      setValues(null);
    }
  }, [data, setValues]);

  const getJobPostPreview = (): JobPost | null => {
    const title = form.getValues('title');
    const company = form.getValues('company');
    const location = form.getValues('location');
    const body = form.getValues('body');

    if (!title && !company && !location && !body) {
      return null;
    }

    return {
      ...form.getValues(),
      created_at: new Date().toJSON(),
      id: 1,
      expired: false,
      updated_at: new Date().toJSON(),
      deadline: form.getValues().deadline.toJSON(),
      class_start: parseInt(form.getValues('class_start')),
      class_end: parseInt(form.getValues('class_end')),
      link: form.getValues('link') || '',
      email: form.getValues('email') || '',
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (jobpostId) {
      updateJobPost.mutate(
        { ...values, deadline: values.deadline.toJSON(), class_start: parseInt(values.class_start), class_end: parseInt(values.class_end) },
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
      createJobPost.mutate(
        { ...values, deadline: values.deadline.toJSON(), class_start: parseInt(values.class_start), class_end: parseInt(values.class_end) },
        {
          onSuccess: (newJobPost) => {
            toast.success('Annonsen ble opprettet');
            goToJobPost(newJobPost.id);
          },
          onError: (e) => {
            toast.error(e.detail);
          },
        },
      );
    }
  };

  if (isLoading) {
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
              name='is_continuously_hiring'
              render={({ field }) => (
                <FormItem className='space-x-16 md:space-x-0 flex flex-row items-center justify-between rounded-md border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Fortløpende opptak?</FormLabel>
                    <FormDescription>Huk av om annonsen er fortløpende opptak.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='space-y-6 w-full md:flex md:space-x-4 md:space-y-0'>
              <DateTimePicker form={form} label='Utløpsdato' name='deadline' required />

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

            <FormImageUpload form={form} label='Velg logo' name='image' ratio='21:9' />

            <FormField
              control={form.control}
              name='image_alt'
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
                  name='class_start'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Fra årstrinn</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
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
                />

                <FormField
                  control={form.control}
                  name='class_end'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Til årstrinn</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={field.value} />
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
                />
              </div>

              <FormField
                control={form.control}
                name='job_type'
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
