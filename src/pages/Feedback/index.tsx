import { zodResolver } from '@hookform/resolvers/zod';
import { BugIcon, ChevronDownIcon, ChevronUpIcon, LightbulbIcon, PlusIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useCreateFeedback, useDeleteFeedback, useFeedbacks, useFeedbackVotes } from 'hooks/Feedback';
import { useUser, useUserMemberships } from 'hooks/User';

import { Button, PaginateButton } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import ResponsiveAlertDialog from 'components/ui/responsive-alert-dialog';
import ResponsiveDialog from 'components/ui/responsive-dialog';
import { Textarea } from 'components/ui/textarea';

type Filters = {
  search?: string;
  feedback_type?: string;
};

const ideaFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Tittelen må være minst 2 tegn.',
    })
    .max(50, {
      message: 'Tittelen kan ikke overstige 50 tegn.',
    }),
  description: z
    .string()
    .min(10, {
      message: 'Beskrivelsen må være minst 10 tegn.',
    })
    .max(500, {
      message: 'Beskrivelsen kan ikke overstige 500 tegn.',
    }),
});

const bugFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Tittelen må være minst 2 tegn.',
    })
    .max(50, {
      message: 'Tittelen kan ikke overstige 50 tegn.',
    }),
  description: z
    .string()
    .min(10, {
      message: 'Beskrivelsen må være minst 10 tegn.',
    })
    .max(500, {
      message: 'Beskrivelsen kan ikke overstige 500 tegn.',
    }),
});

export default function Feedback() {
  const [openIdea, setOpenIdea] = useState(false);
  const [openBug, setOpenBug] = useState(false);
  const [thumbsUpCount, setThumbsUp] = useState(0);
  const [thumbsDownCount, setThumbsDown] = useState(0);
  const getInitialFilters = useCallback((): Filters => {
    const params = new URLSearchParams(location.search);
    const feedback_type = params.get('feedback_type') || undefined;
    const search = params.get('search') || undefined;
    return { feedback_type, search };
  }, []);

  const [filters, setFilters] = useState<Filters>(getInitialFilters());

  const { data: user } = useUser();
  const { data: userGroups } = useUserMemberships();
  const memberships = useMemo(() => (userGroups ? userGroups.pages.map((page) => page.results).flat() : []), [userGroups]);

  const { data: feedbacksData, hasNextPage, fetchNextPage, isFetching } = useFeedbackVotes(filters);
  const feedbacks = useMemo(() => (feedbacksData !== undefined ? feedbacksData.pages.flatMap((page) => page.results) : []), [feedbacksData]);

  const createFeedback = useCreateFeedback();
  const deleteFeedback = useDeleteFeedback();

  const ideaForm = useForm<z.infer<typeof ideaFormSchema>>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const bugForm = useForm<z.infer<typeof bugFormSchema>>({
    resolver: zodResolver(bugFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  function onSubmitIdea(values: z.infer<typeof ideaFormSchema>) {
    createFeedback.mutate(
      {
        feedback_type: 'Idea',
        ...values,
      },
      {
        onSuccess: () => {
          toast.success('Ideen ble registrert');
          setOpenIdea(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  }

  function onSubmitBug(values: z.infer<typeof bugFormSchema>) {
    createFeedback.mutate(
      {
        feedback_type: 'Bug',
        ...values,
      },
      {
        onSuccess: () => {
          toast.success('Feilen ble registrert');
          setOpenBug(false);
        },
        onError: (e) => {
          toast.error(e.detail);
        },
      },
    );
  }

  const onDeleteFeedback = (feedbackId: number) => {
    deleteFeedback.mutate(feedbackId, {
      onSuccess: () => {
        toast.success('Tilbakemeldingen ble slettet');
      },
      onError: (e) => {
        toast.error(e.detail);
      },
    });
  };

  const handleThumbsUp = () => {
    setThumbsUp(thumbsUpCount + 1);
  };

  const handleThumbsDown = () => {
    setThumbsDown(thumbsDownCount + 1);
  };

  return (
    <div className='max-w-5xl mx-auto pt-12 relative px-4 pb-12'>
      <div className='absolute top-44 right-0 bg-cyan-400/30 w-32 h-32 rounded-full blur-3xl'></div>
      <div className='absolute top-56 right-44 bg-cyan-400/30 w-32 h-32 rounded-full blur-3xl'></div>

      <div className='mt-24'>
        <p className='text-xs py-0.5 px-2.5 dark:bg-cyan-600 bg-cyan-500 text-white w-fit rounded-full dark:text-cyan-300   mb-2'>Brukerinnspill</p>
        <h1 className='text-2xl sm:text-6xl font-semibold max-w-3xl leading-tight'>
          Kom med nye idéer <br />
          og rapporter feil på siden
        </h1>
      </div>
      <p className='mt-6 text-sm sm:text-2xl max-w-4xl leading-relaxed text-gray-400'>
        Index tester noe nytt! Vi skal la brukere komme med ideer og gi tilbakemelding på ting som fungerer dårlig eller kunne blitt gjort bedre. Alle skal også
        kunne stemme på ideer og ting som må fikses, så vi vet hvor det brenner mest.
      </p>

      <div className='mt-12 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-2'>
        <div className='flex'>
          <ResponsiveDialog
            onOpenChange={setOpenIdea}
            open={openIdea}
            trigger={
              <Button className='ml-2' variant='outline'>
                <PlusIcon className='w-4 h-4' />
                Ny Idé
              </Button>
            }>
            <div className='pl-5 pr-5'>
              <Form {...ideaForm}>
                <form className='space-y-8' onSubmit={ideaForm.handleSubmit(onSubmitIdea)}>
                  <FormField
                    control={ideaForm.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tittel</FormLabel>
                        <FormControl>
                          <Input placeholder='Skriv inn tittel på ideen' {...field} />
                        </FormControl>
                        <FormDescription>Gi en kort og konsis tittel for ideen.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ideaForm.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beskrivelse</FormLabel>
                        <FormControl>
                          <Textarea className='resize-none' placeholder='Beskriv ideen i detalj' {...field} />
                        </FormControl>
                        <FormDescription>Gi en detaljert beskrivelse av ideen.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit'>Send inn</Button>
                </form>
              </Form>
            </div>
          </ResponsiveDialog>
          <ResponsiveDialog
            onOpenChange={setOpenBug}
            open={openBug}
            trigger={
              <Button className='ml-2' variant='outline'>
                <PlusIcon className='w-4 h-4' />
                Ny Feil
              </Button>
            }>
            <div className='pl-5 pr-5'>
              <Form {...bugForm}>
                <form className='space-y-8' onSubmit={bugForm.handleSubmit(onSubmitBug)}>
                  <FormField
                    control={bugForm.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tittel</FormLabel>
                        <FormControl>
                          <Input placeholder='Skriv inn tittel på feilen' {...field} />
                        </FormControl>
                        <FormDescription>Gi en kort og konsis tittel for feilen.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bugForm.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beskrivelse</FormLabel>
                        <FormControl>
                          <Textarea className='resize-none' placeholder='Beskriv feilen i detalj' {...field} />
                        </FormControl>
                        <FormDescription>Gi en detaljert beskrivelse av feilen.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit'>Send inn</Button>
                </form>
              </Form>
            </div>
          </ResponsiveDialog>
        </div>
      </div>

      <div className='my-4 sm:my-18 space-y-4'>
        {feedbacks.length === 0 ? (
          <Card>
            <CardContent className='p-1 h-80 flex flex-col items-center justify-center gap-6'>
              <div className=''>Ingen tilbakemeldinger rapportert</div>
              <BugIcon className='w-20 h-20 text-gray-800 dark:text-blue-950/90' />
            </CardContent>
          </Card>
        ) : (
          feedbacks.map((item, index) => (
            <Collapsible
              className='w-full bg-white dark:bg-white/[1%] border border-white/10 dark:border-white/10 rounded-lg overflow-hidden'
              key={index}
              onOpenChange={() => toggleItem(item.id)}
              open={openItems.includes(item.id)}>
              <CollapsibleTrigger className='w-full p-4 flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  {item.feedback_type === 'Bug' ? <BugIcon className='w-6 h-6 text-red-400' /> : <LightbulbIcon className='w-6 h-6 text-yellow-400' />}
                  <span className='font-medium truncate max-w-md'>{item.title}</span>
                </div>
                <div className='flex items-center space-x-4'>
                  {openItems.includes(item.id) ? <ChevronUpIcon className='w-4 h-4' /> : <ChevronDownIcon className='w-4 h-4' />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className='p-4 border-t dark:border-white/10 dark:bg-white/[2%] '>
                <p className='pl-2 pb-4 text-gray-700 dark:text-gray-300'>{item.description}</p>
                <div className='flex justify-between items-center'>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mt-2 pl-2'>
                    Opprettet:{' '}
                    {new Date(item.created_at).toLocaleString('no-NO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className='flex flex-row items-center space-x-8'>
                    <div className='flex space-x-4'>
                      <div className='flex items-center space-x-2'>
                        <button className='flex items-center space-x-2' type='button'>
                          👍
                        </button>
                        <span>{item.upvotes}</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <button className='flex items-center space-x-2' type='button'>
                          👎
                        </button>
                        <span>{item.downvotes}</span>
                      </div>
                    </div>
                    {(item.author.user_id === user?.user_id || memberships.some((membership) => membership.group?.slug === 'index')) && (
                      <ResponsiveAlertDialog
                        action={() => onDeleteFeedback(item.id)}
                        description='Er du sikker på at du vil slette feedbacken? Dette kan ikke angres.'
                        title='Slett feedback?'
                        trigger={
                          <Button className='md:w-40 block' type='button' variant='destructive'>
                            Slett feedback
                          </Button>
                        }
                      />
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}

        {hasNextPage && <PaginateButton className='w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </div>
  );
}
