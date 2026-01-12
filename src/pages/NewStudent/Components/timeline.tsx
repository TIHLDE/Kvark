import React, { useState } from 'react';

import GCard from './Card';
import InfoMenu from './infoMenu';
import { gKnapp as GKnapp } from './Knapp';
import StepIndicator from './StepIndicator';

const Timeline: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedStage, setSelectedStage] = useState<number | null>(1);

  const stages = [
    { id: 1, title: 'Påmelding og betaling', description: 'Alt du trenger er under!' },
    {
      id: 2,
      title: 'Eksamen og semesteravgift',
      description: 'Meld deg på eksamen og betal semesteravgift! https://fsweb.no/studentweb/login.jsf?inst=FSNTNU',
    },
    { id: 3, title: 'Timeplan og klasseoversikt', description: 'Link kommer etterhvert' },
    { id: 4, title: 'Fadderuka og bli kjent', description: 'Link kommer etterhvert' },
    { id: 5, title: 'Første skoledag', description: 'Link kommer etterhvert' },
  ];

  // Manually set text for each stage here
  const stageInfoTexts: Record<number, string> = {
    1: 'To be continued',
    2: 'Gå inn på Studentweb og følg instruksjonene for å melde deg på eksamen og betale semesteravgiften. Husk å gjøre dette innen fristen for å unngå problemer senere.',
    3: 'Trykk på linken for å se en oversikt over hvem du skal dele de neste semestrene med! Timeplanen din vil være tilgjengelig på ""',
    4: 'To be continued',
    5: 'Info om hvor du skal møte opp for å få mer inforrmasjon om studiestart får du i linken over.',
  };

  const current = stages.find((stage) => stage.id === currentStage);
  const handleStageClick = (stageId: number) => {
    setCurrentStage(stageId);
    setSelectedStage(stageId);
  };

  return (
    <div className='w-full flex flex-col items-center space-y-8'>
      <StepIndicator stages={stages} currentStage={currentStage} onSelectStage={handleStageClick} />

      {selectedStage !== 1 && (
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>{current?.title}</h3>
          {currentStage === 2 ? (
            <a
              href='https://fsweb.no/studentweb/login.jsf?inst=FSNTNU'
              target='_blank'
              rel='noreferrer'
              className='text-sky-700 hover:text-sky-800 underline dark:text-sky-300 dark:hover:text-sky-200 mt-2 inline-block'>
              Klikk her for studentweb!
            </a>
          ) : (
            <p className='text-slate-600 dark:text-slate-300 mt-2'>{current?.description}</p>
          )}
        </div>
      )}

      <div className='flex items-center gap-3'>
        <button
          onClick={() => handleStageClick(Math.max(1, currentStage - 1))}
          disabled={currentStage === 1}
          className='inline-flex items-center rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm font-medium'>
          Tilbake
        </button>
        <button
          onClick={() => handleStageClick(Math.min(stages.length, currentStage + 1))}
          disabled={currentStage === stages.length}
          className='inline-flex items-center rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 px-3 py-2 text-sm font-medium'>
          Neste steg
        </button>
      </div>

      {selectedStage !== null && (
        <div className='w-full max-w-4xl'>
          {selectedStage !== 1 && <InfoMenu title={stages.find((s) => s.id === selectedStage)?.title} stageId={selectedStage} stageTexts={stageInfoTexts} />}
          {selectedStage === 1 && (
            <div className='mt-4 space-y-3'>
              <GCard
                tittel='Fadderuke påmelding'
                beskrivelse='Fullfør betalingen på vipps til 519679 for å sikre plass i fadderuka. Betalingen er på 500kr.'
                kroner={500}
              />
              <div className='flex justify-end'>
                <GKnapp tekst='Betal 500 kr' onClick={() => console.log('Betaling initiert')} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;
