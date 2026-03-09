import { createFileRoute } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/_MainLayout/DNV')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className='relative overflow-hidden bg-background text-foreground'>
      <div className='pointer-events-none absolute -bottom-24 left-1 h-96 w-24 rotate-45 bg-blue-900/25 blur-3xl dark:bg-blue-500/20' />
      <div className='pointer-events-none absolute -bottom-64 right-0 h-72 w-72 bg-blue-900/10 blur-3xl dark:bg-blue-500/10 lg:h-96 lg:w-96' />
      <div className='pointer-events-none absolute -top-40 right-24 h-96 w-96 bg-blue-900/20 blur-3xl dark:bg-blue-500/20' />

      <div className='relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 pb-20 pt-24 md:pt-28'>
        <section className='mx-auto max-w-2xl text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.2em] text-primary'>Offisiell partnerbedrift</p>
          <h1 className='mt-4 text-5xl font-black leading-none md:whitespace-nowrap md:text-6xl lg:text-7xl'>
            TIHLDE <span className='text-primary'>X</span> DNV
          </h1>
          <p className='mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base'>
            DNV er en global leder innen kvalitetssikring og risikohåndtering, og en av Norges mest attraktive teknologiarbeidsgivere. Som partner med TIHLDE
            bygger vi broen mellom akademia og industrien.
          </p>
          <Button asChild className='mt-7' size='lg'>
            <a href='https://www.dnv.com' rel='noreferrer' target='_blank'>
              Bli kjent med DNV
              <ArrowRight className='h-4 w-4' />
            </a>
          </Button>
        </section>

        <section className='grid gap-8 rounded-3xl border bg-black/5 px-6 py-8 md:grid-cols-[1.2fr_1fr] md:gap-10 md:px-8 md:py-10 dark:bg-slate-950/30'>
          <div>
            <p className='text-sm font-medium text-primary'>Hvem er DNV?</p>
            <h2 className='mt-2 text-4xl font-extrabold leading-tight'>Innovasjon for en tryggere framtid</h2>
            <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
              DNV er et uavhengig, globalt selskap med over 15 000 ansatte i mer enn 100 land. Med rotter tilbake til 1864 er DNV i dag verdens ledende
              klassifikasjonsselskap og en anerkjent radgiver innen maritim, olje og gass, energi og helse.
            </p>
            <p className='mt-4 text-sm leading-relaxed text-muted-foreground'>
              Selskapets formål er å sikre liv, verdier og miljø. DNV kombinerer teknisk ekspertise, digital innovasjon og dyp bransjekunnskap for å hjelpe
              kunder med å ta trygge og bærekraftige beslutninger.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 self-center'>
            <StatCard title='#1' subtitle='Klassifikasjonsselskap' />
            <StatCard title='100+' subtitle='Land' />
            <StatCard title='160' subtitle='År med erfaring' />
            <StatCard title='15 000+' subtitle='Ansatte globalt' />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div className='rounded-xl border border-black/10 bg-white/50 px-4 py-5 text-center shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-black/35'>
      <p className='text-4xl font-bold leading-none text-primary'>{title}</p>
      <p className='mt-2 text-sm text-muted-foreground'>{subtitle}</p>
    </div>
  );
}
