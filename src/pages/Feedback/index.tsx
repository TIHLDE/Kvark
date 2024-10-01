import { zodResolver } from '@hookform/resolvers/zod';
import { BugIcon, ChevronDownIcon, ChevronUpIcon, LightbulbIcon, PlusIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from 'components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { Dialog, DialogContent, DialogTrigger } from 'components/ui/dialog'; // Assuming you have a Dialog component
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { Textarea } from 'components/ui/textarea';

const fakeBugs = [
  {
    type: 'bug',
    id: 1,
    points: 10,
    title: 'Bug 1',
    description: 'Bug 1 description',
    created_at: new Date(),
  },
  {
    type: 'bug',
    id: 2,
    points: 8,
    title: 'Bug 2',
    description: 'Bug 2 description',
    created_at: new Date(),
  },
  {
    type: 'idea',
    id: 3,
    points: 5,
    title: 'Idé 3',
    description: 'Idé 3 description',
    created_at: new Date(),
  },
];

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

  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');

  const filteredAndSortedBugs = fakeBugs
    .filter((item) => {
      if (filter === 'all') {
        return true;
      }
      return item.type === filter;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'most-points':
          return b.points - a.points;
        case 'least-points':
          return a.points - b.points;
        case 'oldest':
          return a.created_at.getTime() - b.created_at.getTime();
        case 'newest':
        default:
          return b.created_at.getTime() - a.created_at.getTime();
      }
    });

  function onSubmitIdea(values: z.infer<typeof ideaFormSchema>) {
    // Handle idea form submission
    console.log(values);
  }

  function onSubmitBug(values: z.infer<typeof bugFormSchema>) {
    // Handle bug form submission
    console.log(values);
  }

  return (
    <div className='max-w-5xl mx-auto pt-12 relative px-4'>
      <div className='absolute top-44 right-0 bg-cyan-400/30 w-32 h-32 rounded-full blur-3xl'></div>
      <div className='absolute top-56 right-44 bg-cyan-400/30 w-32 h-32 rounded-full blur-3xl'></div>

      <div className='mt-44'>
        <p className='text-xs py-0.5 px-2.5 dark:bg-cyan-600 bg-cyan-500 text-white w-fit rounded-full dark:text-cyan-300   mb-2'>Brukerinnspill</p>
        <h1 className='text-2xl md:text-6xl font-semibold max-w-3xl leading-tight'>
          Kom med nye idéer <br />
          og rapporter feil på siden
        </h1>
      </div>
      <p className='mt-6 text-sm md:text-2xl max-w-4xl leading-relaxed text-gray-400'>
        Index tester noe nytt! Vi skal la brukere komme med ideer og gi tilbakemelding på ting som fungerer dårlig eller kunne blitt gjort bedre. Alle skal også
        kunne stemme på ideer og ting som må fikses, så vi vet hvor det brenner mest.
      </p>

      <div className='mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-2'>
        <div className='flex flex-col md:flex-row gap-2 mb-8 md:mb-0'>
          <Select defaultValue='all' onValueChange={setFilter}>
            <SelectTrigger className='w-[180px] bg-white dark:bg-transparent'>
              <SelectValue placeholder='Filter' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Alle</SelectItem>
              <SelectItem value='bug'>Bugs</SelectItem>
              <SelectItem value='idea'>Ideer</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue='newest' onValueChange={setSort}>
            <SelectTrigger className='w-[180px] bg-white dark:bg-transparent'>
              <SelectValue placeholder='Sorter' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Nyeste</SelectItem>
              <SelectItem value='oldest'>Eldste</SelectItem>
              <SelectItem value='most-points'>Flest poeng</SelectItem>
              <SelectItem value='least-points'>Færrest poeng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex'>
          <Dialog>
            <DialogTrigger asChild>
              <Button className=' ml-auto' variant='outline'>
                <PlusIcon className='w-4 h-4' />
                Ny Idé
              </Button>
            </DialogTrigger>
            <DialogContent>
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
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className='ml-2' variant='outline'>
                <PlusIcon className='w-4 h-4' />
                Ny Feil
              </Button>
            </DialogTrigger>
            <DialogContent>
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
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='my-4 md:my-8 space-y-4'>
        {filteredAndSortedBugs.map((item) => (
          <Collapsible
            className='w-full bg-white dark:bg-white/[1%] border border-white/10 dark:border-white/10 rounded-lg overflow-hidden'
            key={item.id}
            onOpenChange={() => toggleItem(item.id)}
            open={openItems.includes(item.id)}>
            <CollapsibleTrigger className='w-full p-4 flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                {item.type === 'bug' ? <BugIcon className='w-6 h-6 text-red-400' /> : <LightbulbIcon className='w-6 h-6 text-yellow-400' />}
                <span className='font-medium truncate max-w-md'>{item.title}</span>
              </div>
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-gray-400'>{item.points} poeng</span>
                <Button className='w-8 h-8 p-0' onClick={(e) => e.preventDefault()} size='sm' variant='outline'>
                  <ThumbsUpIcon className='w-4 h-4' />
                </Button>
                <Button className='w-8 h-8 p-0' onClick={(e) => e.preventDefault()} size='sm' variant='outline'>
                  <ThumbsDownIcon className='w-4 h-4' />
                </Button>
                {openItems.includes(item.id) ? <ChevronUpIcon className='w-4 h-4' /> : <ChevronDownIcon className='w-4 h-4' />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className='p-4 border-t dark:border-white/10 dark:bg-white/[2%] '>
              <p className='text-lg text-gray-700 dark:text-gray-300'>{item.description}</p>
              <p className='text-xs text-gray-600 dark:text-gray-400 mt-2'>Opprettet: {item.created_at.toLocaleString()}</p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
