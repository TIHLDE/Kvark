import React, { useState } from 'react';

import Card from './Card';
import InfoMenu from './infoMenu';
import StepIndicator from './StepIndicator';

const Timeline: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedStage, setSelectedStage] = useState<number | null>(1);

  const stages = [
    { id: 1, title: 'Første skoledag', description: 'Link kommer' },
    { id: 2, title: 'Meld deg til eksamen, og betal semesteravgift', description: 'Link kommer etterhvert' },
    { id: 3, title: 'Timeplan og klasseoversikt', description: 'Link kommer etterhvert' },
    { id: 4, title: 'Påmelding og betaling til fadderuka', description: 'Alt du trenger er under!' },
  ];

  // Updated stageInfoTexts to reflect the removal of stage 2
  const stageInfoTexts: Record<number, string> = {
    1: 'To be continued',
    2: 'Husk å betal semesteravgiften før fristen!',
    3: 'Link for timeplan er er "", og klasseoversikten kan du finne på "".',
    4: 'Påmelding til fadderuka skjer via vår egen fadderuka-side, som du finner her: "".',
  };

  const current = stages.find((stage) => stage.id === currentStage);
  const handleStageClick = (stageId: number) => {
    setCurrentStage(stageId);
    setSelectedStage(stageId);
  };

  return (
    <div className='w-full flex flex-col items-center space-y-8'>
      <StepIndicator stages={stages} currentStage={currentStage} onSelectStage={handleStageClick} />

      {selectedStage !== null && (
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>{current?.title}</h3>
          <p className='text-slate-600 dark:text-slate-300 mt-2'>{current?.description}</p>
        </div>
      )}

      {selectedStage !== null && (
        <div className='w-full max-w-4xl'>
          {selectedStage !== 4 && <InfoMenu title={stages.find((s) => s.id === selectedStage)?.title} stageId={selectedStage} stageTexts={stageInfoTexts} />}
          {selectedStage === 4 && (
            <div className='mt-4 space-y-3'>
              <Card
                tittel='Fadderuke påmelding'
                beskrivelse='Fullfør betalingen på vipps til 519679 for å sikre plass i fadderuka. Betalingen er på 500kr.'
                kroner={500}
              />
              {/* <div className='flex justify-end'>
                <Button tekst='Betal 500 kr' onClick={() => console.log('Knapp trykket')} />
                </div> */}
            </div>
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
          className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50 transition-colors
            ${currentStage === stages.length ? 'bg-green-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'}`}>
          {currentStage === stages.length ? 'Alt er klart! Velkommen til TIHLDE ' : 'Neste steg'}
        </button>
      </div>
    </div>
  );
};

export default Timeline;
