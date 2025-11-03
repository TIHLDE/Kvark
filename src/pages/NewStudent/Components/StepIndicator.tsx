import { Check } from 'lucide-react'; //
import React from 'react';

interface StepIndicatorProps {
  stages: { id: number; title: string }[];
  currentStage: number;
  onSelectStage: (id: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ stages, currentStage, onSelectStage }) => {
  return (
    <div className='w-full flex justify-center'>
      <div className='flex items-center justify-center w-full max-w-4xl'>
        {stages.map((stage, index) => {
          const isActive = stage.id <= currentStage;
          const isCompleted = stage.id < currentStage;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className='flex items-center w-full last:w-auto'>
              {/* Sirkel */}
              <div
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 cursor-pointer z-10
                    ${
                      isCompleted
                        ? 'bg-white dark:bg-slate-800 border-green-500 text-green-600 dark:text-green-400'
                        : isActive
                          ? 'bg-white dark:bg-slate-800 border-sky-600 text-sky-600 dark:text-sky-300'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 hover:border-sky-400'
                    }
                    `}>
                {isCompleted ? <Check className='w-5 h-5 text-green-600 dark:text-white' strokeWidth={3} /> : stage.id}
              </div>

              {/* Linje mellom steg */}
              {!isLast && (
                <div className={`flex-grow h-0.5 transition-colors duration-300 ${isCompleted ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
