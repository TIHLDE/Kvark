import { cn } from '~/lib/utils';
import { Check, type LucideIcon } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  stages: Stage[];
  currentStage: number;
  onSelectStage: (id: number) => void;
}

const StepIndicator = ({ stages, currentStage, onSelectStage }: StepIndicatorProps) => {
  return (
    <div className='w-full'>
      <div className='flex items-start justify-between w-full max-w-3xl mx-auto'>
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isCompleted = stage.id < currentStage;
          const isLast = index === stages.length - 1;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className='flex items-start flex-1 last:flex-none'>
              <div className='flex flex-col items-center'>
                <button
                  type='button'
                  onClick={() => onSelectStage(stage.id)}
                  className={cn(
                    'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-300 cursor-pointer z-10',
                    isCompleted && 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-600 dark:text-green-400',
                    isActive && 'bg-primary/10 dark:bg-primary/20 border-primary text-primary ring-4 ring-primary/20',
                    !isActive && !isCompleted && 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary/70',
                  )}>
                  {isCompleted ? <Check className='w-5 h-5 md:w-6 md:h-6' strokeWidth={2.5} /> : <Icon className='w-5 h-5 md:w-6 md:h-6' />}
                </button>

                <span
                  className={cn(
                    'mt-2 text-xs md:text-sm font-medium text-center max-w-[80px] md:max-w-[100px] leading-tight transition-colors duration-300',
                    isActive && 'text-primary font-semibold',
                    isCompleted && 'text-green-600 dark:text-green-400',
                    !isActive && !isCompleted && 'text-muted-foreground',
                  )}>
                  <span className='md:hidden'>{stage.shortTitle}</span>
                  <span className='hidden md:inline'>{stage.title}</span>
                </span>
              </div>

              {!isLast && (
                <div className='flex-1 flex items-center px-2 mt-6 md:mt-7'>
                  <div className={cn('h-0.5 w-full transition-colors duration-300 rounded-full', isCompleted ? 'bg-green-500' : 'bg-border')} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
