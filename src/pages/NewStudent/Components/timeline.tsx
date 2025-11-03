import React, { useState } from 'react';

const Timeline: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);

  const stages = [
    {
      id: 1,
      title: 'Steg 1, påmelding og betaling',
      description: 'Alt du trenger er ovenfor!',
    },
    {
      id: 2,
      title: 'Steg 2, Påmelding eksamen og betaling semesteravgift',
      description: 'https://fsweb.no/studentweb/login.jsf?inst=FSNTNU',
    },
    {
      id: 3,
      title: 'Steg 3, Få en oversikt over klassen og timeplanen fremover',
      description: 'Link kommer etterhvert',
    },
    {
      id: 4,
      title: 'Steg 4, Stalk dine nye klassekamerater, og gå videre til Tihldes egne fadderuke side!',
      description: 'Link kommer for klasseliste og fadderuke',
    },
  ];

  const handleNext = () => {
    if (currentStage < stages.length) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  return (
    <div className='w-full space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stages.map((stage) => {
          const isActive = currentStage === stage.id;
          return (
            <div
              key={stage.id}
              className={`rounded-xl border p-4 transition-shadow ${
                isActive
                  ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}>
              <h3 className='text-lg font-semibold'>{stage.title}</h3>
              {typeof stage.description === 'string' && /^https?:\/\//.test(stage.description) ? (
                <a
                  href={stage.description}
                  target='_blank'
                  rel='noreferrer'
                  className='mt-1 inline-block text-sky-700 hover:text-sky-800 underline dark:text-sky-300 dark:hover:text-sky-200'>
                  Klikk her
                </a>
              ) : (
                <p className='mt-1 text-slate-600 dark:text-slate-300'>{stage.description}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={handleBack}
          disabled={currentStage === 1}
          className='inline-flex items-center rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm font-medium'>
          Tilbake
        </button>
        <button
          type='button'
          onClick={handleNext}
          disabled={currentStage === stages.length}
          className='inline-flex items-center rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-sm font-medium'>
          Ferdig, klar for neste steg
        </button>
      </div>
    </div>
  );
};

export default Timeline;
