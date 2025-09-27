import { authClientWithRedirect } from '~/api/auth';
import { handleFormSubmit, useAppForm } from '~/components/forms/AppForm';
import { Button, PaginateButton } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import ResponsiveAlertDialog from '~/components/ui/responsive-alert-dialog';
import ResponsiveDialog from '~/components/ui/responsive-dialog';
import { Textarea } from '~/components/ui/textarea';
import { useCreateReaction, useDeleteReaction } from '~/hooks/EmojiReaction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useCreateFeedback, useDeleteFeedback, useFeedbacks } from '~/hooks/Feedback';
import { useUser, useUserMemberships } from '~/hooks/User';
import type { Feedback } from '~/types/Feedback';
import { BugIcon, ChevronDownIcon, ChevronUpIcon, LightbulbIcon, PlusIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';

import { Route } from './+types';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await authClientWithRedirect(request);
}

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

export default function Feedback() {
  const [openIdea, setOpenIdea] = useState(false);
  const [openBug, setOpenBug] = useState(false);

  const [feedbackTypeFilter, setFeedbackTypeFilter] = useQueryState('type', parseAsString.withDefault(''));

  function handleFeedbackTypeFilterChange(value: string) {
    setFeedbackTypeFilter(value === '__clear' ? '' : value);
  }

  const filters = useMemo(() => {
    return {
      feedback_type: feedbackTypeFilter as string | undefined,
    };
  }, [feedbackTypeFilter]);

  const { data: user } = useUser();
  const { data: userGroups } = useUserMemberships();
  const memberships = useMemo(() => (userGroups ? userGroups.pages.map((page) => page.results).flat() : []), [userGroups]);

  const { data: feedbacksData, hasNextPage, fetchNextPage, isFetching, refetch: refetchFeedbacks } = useFeedbacks(filters);
  const feedbacks = useMemo(() => (feedbacksData !== undefined ? feedbacksData.pages.flatMap((page) => page.results) : []), [feedbacksData]);

  const createFeedback = useCreateFeedback();
  const deleteFeedback = useDeleteFeedback();
  const { mutateAsync: createReaction } = useCreateReaction();
  const { mutateAsync: deleteReaction } = useDeleteReaction();

  const userHasReacted = useCallback(
    (item: Feedback, emoji: string) => item.reactions?.some((r) => r.user?.user_id === user?.user_id && r.emoji === emoji) ?? false,
    [user?.user_id],
  );

  const reactionWrapClass = (active: boolean) =>
    `flex items-center space-x-2 rounded-md px-2 py-1 transition ${active ? 'bg-gray-200 dark:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-white/[0.04]'}`;

  async function submitFeedback(feedbackType: 'Idea' | 'Bug', values: FormValues) {
    return await createFeedback.mutateAsync(
      {
        feedback_type: feedbackType,
        ...values,
      },
      {
        onSuccess: () => {
          toast.success('Tilbakemeldingen ble registrert');
          setOpenIdea(false);
          setOpenBug(false);
        },
        onError(e: { detail?: string }) {
          toast.error(e.detail || 'Noe gikk galt');
        },
      },
    );
  }

  const ideaForm = useAppForm({
    validators: {
      onBlur: formSchema,
      async onSubmitAsync({ value }) {
        await submitFeedback('Idea', value);
      },
    },
    defaultValues: { title: '', description: '' } as FormValues,
  });

  const bugForm = useAppForm({
    validators: {
      onBlur: formSchema,
      async onSubmitAsync({ value }) {
        await submitFeedback('Bug', value);
      },
    },
    defaultValues: { title: '', description: '' } as FormValues,
  });

  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

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

  const handleThumbsUp = async (item: Feedback) => {
    for (const reaction of item.reactions ?? []) {
      // If already upvoted, do nothing
      if (reaction.user?.user_id === user?.user_id && reaction.emoji === ':thumbs-up:') {
        await deleteReaction(reaction.reaction_id, {
          onSuccess: async () => {
            await refetchFeedbacks();
          },
        });
        return;
      }
      if (reaction.user?.user_id === user?.user_id && reaction.emoji === ':thumbs-down:') {
        await deleteReaction(reaction.reaction_id);
        break;
      }
    }

    await createReaction(
      { content_type: 'feedback', object_id: item.id, emoji: ':thumbs-up:' },
      {
        onSuccess: async () => {
          await refetchFeedbacks();
        },
      },
    );
  };

  const handleThumbsDown = async (item: Feedback) => {
    for (const reaction of item.reactions ?? []) {
      if (reaction.user?.user_id === user?.user_id && reaction.emoji === ':thumbs-down:') {
        await deleteReaction(reaction.reaction_id, {
          onSuccess: async () => {
            await refetchFeedbacks();
          },
        });
        return;
      }
      if (reaction.user?.user_id === user?.user_id && reaction.emoji === ':thumbs-up:') {
        await deleteReaction(reaction.reaction_id);
        break;
      }
    }

    await createReaction(
      { content_type: 'feedback', object_id: item.id, emoji: ':thumbs-down:' },
      {
        onSuccess: async () => {
          await refetchFeedbacks();
        },
      },
    );
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
              <form className='space-y-8' onSubmit={handleFormSubmit(ideaForm)}>
                <ideaForm.AppField name='title'>{(field) => <field.InputField label='Tittel' placeholder='Skriv inn tittel på ideen' />}</ideaForm.AppField>
                <ideaForm.AppField name='description'>
                  {(field) => <field.TextareaField className='resize-none' label='Beskrivelse' placeholder='Beskriv ideen i detalj' />}
                </ideaForm.AppField>
                <ideaForm.AppForm>
                  <ideaForm.SubmitButton type='submit'>Send inn</ideaForm.SubmitButton>
                </ideaForm.AppForm>
              </form>
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
              <form className='space-y-8' onSubmit={handleFormSubmit(bugForm)}>
                <bugForm.AppField name='title'>{(field) => <field.InputField label='Tittel' placeholder='Skriv inn tittel på feilen' />}</bugForm.AppField>
                <bugForm.AppField name='description'>
                  {(field) => <field.TextareaField className='resize-none' label='Beskrivelse' placeholder='Beskriv feilen i detalj' />}
                </bugForm.AppField>
                <bugForm.AppForm>
                  <bugForm.SubmitButton type='submit'>Send inn</bugForm.SubmitButton>
                </bugForm.AppForm>
              </form>
            </div>
          </ResponsiveDialog>
        </div>
        <div>
          <Select value={feedbackTypeFilter} onValueChange={handleFeedbackTypeFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder='Filter' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__clear'>Alle</SelectItem>
              <SelectItem value='Idea'>Idé</SelectItem>
              <SelectItem value='Bug'>Feil</SelectItem>
            </SelectContent>
          </Select>
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
          feedbacks.map((item, index) => {
            const upvoted = userHasReacted(item, ':thumbs-up');
            const downvoted = userHasReacted(item, ':thumbs-down');

            return (
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
                        <button className={reactionWrapClass(upvoted)} disabled={createFeedback.isPending} onClick={() => handleThumbsUp(item)} type='button'>
                          <div aria-pressed={upvoted} className='flex items-center'>
                            👍
                          </div>
                          <span>{item.upvotes ?? 0}</span>
                        </button>
                        <button
                          className={reactionWrapClass(downvoted)}
                          disabled={createFeedback.isPending}
                          onClick={() => handleThumbsDown(item)}
                          type='button'>
                          <div aria-pressed={downvoted} className='flex items-center'>
                            👎
                          </div>
                          <span>{item.downvotes ?? 0}</span>
                        </button>
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
            );
          })
        )}

        {hasNextPage && <PaginateButton className='w-full' isLoading={isFetching} nextPage={fetchNextPage} />}
      </div>
    </div>
  );
}
