import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ExternalLink } from '~/components/ui/external-link';
import { ArrowUpRightFromSquare, CheckCircle2, type LucideIcon } from 'lucide-react';

import FadderukaPaymentCard from './FadderukaPaymentCard';

export interface StageContent {
  heading: string;
  body: string;
  tips?: string[];
  link?: { label: string; href: string };
  showPaymentCard?: boolean;
}

export interface StageData {
  id: number;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  description: string;
  content: StageContent;
}

interface StepContentProps {
  stage: StageData;
  totalStages: number;
}

const StepContent = ({ stage, totalStages }: StepContentProps) => {
  const Icon = stage.icon;

  return (
    <div className='w-full max-w-3xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-300'>
      <Card>
        <CardHeader>
          <div className='flex items-start gap-3'>
            <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary shrink-0'>
              <Icon className='w-5 h-5' />
            </div>
            <div className='space-y-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <CardTitle className='text-xl md:text-2xl'>{stage.content.heading}</CardTitle>
                <Badge variant='secondary' className='text-xs'>
                  Steg {stage.id} av {totalStages}
                </Badge>
              </div>
              <CardDescription>{stage.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <p className='text-foreground leading-relaxed'>{stage.content.body}</p>

          {stage.content.tips && stage.content.tips.length > 0 && (
            <div className='space-y-3'>
              <h4 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>Tips</h4>
              <ul className='space-y-2'>
                {stage.content.tips.map((tip, i) => (
                  <li key={i} className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5 shrink-0' />
                    <span className='text-sm'>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage.content.link && (
            <Button asChild variant='outline' className='w-full sm:w-auto'>
              <ExternalLink href={stage.content.link.href} openNewTab>
                {stage.content.link.label}
                <ArrowUpRightFromSquare className='ml-2 w-4 h-4 stroke-[1.5px]' />
              </ExternalLink>
            </Button>
          )}

          {stage.content.showPaymentCard && <FadderukaPaymentCard />}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepContent;
