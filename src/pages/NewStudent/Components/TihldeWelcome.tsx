import { Sparkles } from 'lucide-react';

const TihldeWelcome = () => {
  return (
    <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent border border-border p-8 md:p-12'>
      <div className='absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/5 dark:bg-primary/10' />
      <div className='absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 dark:bg-primary/10' />

      <div className='relative z-10 text-center space-y-4'>
        <div className='inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary'>
          <Sparkles className='h-4 w-4' />
          Velkommen til TIHLDE
        </div>
        <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>Ny student?</h1>
        <p className='text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto'>
          Her finner du alt du trenger for en god start som ny student. Følg stegene under for å komme i gang!
        </p>
      </div>
    </div>
  );
};

export default TihldeWelcome;
