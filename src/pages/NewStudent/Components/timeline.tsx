import React, { useState } from 'react';

import StepIndicator from './StepIndicator';

const Timeline: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);

  const stages = [
    { id: 1, title: 'Påmelding og betaling', description: 'Alt du trenger er ovenfor!' },
    {
      id: 2,
      title: 'Eksamen og semesteravgift',
      description: 'Meld deg på eksamen og betal semesteravgift! https://fsweb.no/studentweb/login.jsf?inst=FSNTNU',
    },
    { id: 3, title: 'Timeplan og klasseoversikt', description: 'Link kommer etterhvert' },
    { id: 4, title: 'Fadderuka og bli kjent', description: 'Link kommer etterhvert' },
    { id: 5, title: 'Første skoledag', description: 'Link kommer etterhvert' },
  ];

  const current = stages.find((stage) => stage.id === currentStage);

  return (
    <div className='w-full flex flex-col items-center space-y-8'>
      <StepIndicator stages={stages} currentStage={currentStage} onSelectStage={setCurrentStage} />

      <div className='text-center'>
        <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>{current?.title}</h3>
        <p className='text-slate-600 dark:text-slate-300 mt-2'>{current?.description}</p>
      </div>

      <div className='flex items-center gap-3'>
        <button
          onClick={() => setCurrentStage((prev) => Math.max(1, prev - 1))}
          disabled={currentStage === 1}
          className='inline-flex items-center rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm font-medium'>
          Tilbake
        </button>
        <button
          onClick={() => setCurrentStage((prev) => Math.min(stages.length, prev + 1))}
          disabled={currentStage === stages.length}
          className='inline-flex items-center rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 px-3 py-2 text-sm font-medium'>
          Neste steg
        </button>
      </div>
    </div>
  );
};

export default Timeline;
