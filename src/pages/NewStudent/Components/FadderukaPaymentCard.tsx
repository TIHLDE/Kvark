import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import { CreditCard } from 'lucide-react';

const FadderukaPaymentCard = () => {
  return (
    <Card className='border-primary/20 bg-primary/5 dark:bg-primary/10'>
      <CardContent className='p-6'>
        <div className='flex flex-col sm:flex-row items-start justify-between gap-4'>
          <div className='flex items-start gap-4'>
            <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0'>
              <CreditCard className='w-5 h-5' />
            </div>
            <div className='space-y-1'>
              <h3 className='text-lg font-semibold'>Fadderuke-betaling</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Fullfør betalingen på Vipps til <span className='font-mono font-semibold text-foreground'>519679</span> for å sikre plass i fadderuka.
              </p>
            </div>
          </div>
          <Badge className='text-base px-4 py-1.5 shrink-0'>500 kr</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default FadderukaPaymentCard;
