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
          const isLineActive = stage.id < currentStage;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className='flex items-center w-full last:w-auto'>
              {/* Sirkel */}
              <div
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 cursor-pointer z-10
                  ${
                    isActive
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 hover:border-sky-400'
                  }
                `}>
                {stage.id}
              </div>

              {/* Linje mellom steg */}
              {!isLast && (
                <div className={`flex-grow h-0.5 transition-colors duration-300 ${isLineActive ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
