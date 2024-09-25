import { zodResolver } from '@hookform/resolvers/zod';
import { BugIcon, ChevronDownIcon, ChevronUpIcon, LightbulbIcon, PlusIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from 'components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
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

export default function Feedback() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(values);
  }

  return (
    <div className='max-w-5xl mx-auto pt-12 relative'>
      <div className='absolute top-44 right-0 bg-cyan-400/30 w-32 h-32 rounded-full blur-3xl'></div>
      <div className='absolute top-56 right-44 bg-cyan-400/30 w-32 h-32 rounded-full blur-3xl'></div>

      <div className='mt-44'>
        <p className='text-xs py-0.5 px-2.5 bg-cyan-400/30 w-fit rounded-full text-cyan-400   mb-2'>Brukerinnspill</p>
        <h1 className='text-6xl font-semibold max-w-3xl leading-tight'>
          Kom med nye idéer <br />
          og rapporter feil på siden
        </h1>
      </div>
      <p className='mt-6 text-2xl max-w-4xl leading-relaxed text-gray-400'>
        Index tester noe nytt! Vi skal la brukere komme med ideer og gi tilbakemelding på ting som fungerer dårlig eller kunne blitt gjort bedre. Alle skal også
        kunne stemme på ideer og ting som må fikses, så vi vet hvor det brenner mest.
      </p>

      <div className='mt-8 flex justify-between items-center space-x-4'>
        <div className='flex space-x-4'>
          <Select defaultValue='all' onValueChange={setFilter}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Alle</SelectItem>
              <SelectItem value='bug'>Bugs</SelectItem>
              <SelectItem value='idea'>Ideer</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue='newest' onValueChange={setSort}>
            <SelectTrigger className='w-[180px]'>
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
        <div>
          <Button className=' ml-auto' variant='outline'>
            <PlusIcon className='w-4 h-4' />
            Ny Idé
          </Button>
          <Button className='ml-2' variant='outline'>
            <PlusIcon className='w-4 h-4' />
            Ny Feil
          </Button>
        </div>
      </div>

      <div className='my-12 space-y-4'>
        {filteredAndSortedBugs.map((item) => (
          <Collapsible
            className='w-full bg-white/[1%] border border-white/10 rounded-lg overflow-hidden'
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
            <CollapsibleContent className='p-4 border-t border-white/10 bg-white/[2%]'>
              <p className='text-lg text-gray-300'>{item.description}</p>
              <p className='text-xs text-gray-400 mt-2'>Opprettet: {item.created_at.toLocaleString()}</p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* <div className="my-12 rounded-3xl bg-white/5 border border-white/5 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tittel</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv inn tittel på feilen eller ideen" {...field} />
                  </FormControl>
                  <FormDescription>
                    Gi en kort og konsis tittel for feilen eller ideen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beskrivelse</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beskriv feilen eller ideen i detalj"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Gi en detaljert beskrivelse av feilen eller ideen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Send inn</Button>
          </form>
        </Form>
      </div> */}
    </div>
  );
}
