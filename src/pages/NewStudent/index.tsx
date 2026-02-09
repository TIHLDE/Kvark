import { createFileRoute } from '@tanstack/react-router';
import Page from '~/components/navigation/Page';
import { Button } from '~/components/ui/button';
import { BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, GraduationCap, PartyPopper } from 'lucide-react';
import { useState } from 'react';

import StepContent, { type StageData } from './Components/StepContent';
import StepIndicator from './Components/StepIndicator';
import TihldeInfoCard from './Components/TihldeInfoCard';
import TihldeWelcome from './Components/TihldeWelcome';

export const Route = createFileRoute('/_MainLayout/ny-student')({
  component: NewStudent,
});

const stages: StageData[] = [
  {
    id: 1,
    title: 'Første skoledag',
    shortTitle: 'Skoledag',
    description: 'Alt du trenger å vite om din første dag',
    icon: GraduationCap,
    content: {
      heading: 'Velkommen til din første skoledag!',
      body: 'Den aller første skoledagen starter med et velkomstprogram på campus Gløshaugen. Faddergruppen din vil ta imot deg og vise deg rundt.',
      tips: ['Møt opp i god tid på Gløshaugen', 'Ta med studentbevis eller opptaksbekreftelse', 'Sjekk e-posten din for informasjon om faddergruppe'],
      link: { label: 'Les mer om oppstartsdagen', href: 'https://wiki.tihlde.org/ny-student' },
    },
  },
  {
    id: 2,
    title: 'Semesteravgift',
    shortTitle: 'Betaling',
    description: 'Betal semesteravgiften og meld deg til eksamen',
    icon: BookOpen,
    content: {
      heading: 'Husk semesteravgiften!',
      body: 'For å få studentbevis og tilgang til eksamen må du betale semesteravgiften. Dette gjør du gjennom Studentweb.',
      tips: ['Betal semesteravgiften via Studentweb', 'Meld deg opp til eksamen innen fristen', 'Last ned Studentbevis-appen'],
      link: { label: 'Gå til Studentweb', href: 'https://fsweb.no/studentweb/' },
    },
  },
  {
    id: 3,
    title: 'Timeplan og klasser',
    shortTitle: 'Timeplan',
    description: 'Finn timeplanen din og klasseoversikten',
    icon: CalendarDays,
    content: {
      heading: 'Sett opp timeplanen din',
      body: 'Timeplanen din finner du på NTNUs timeplanverktøy. Her ser du alle forelesninger, øvinger og seminarer.',
      tips: ['Sjekk timeplanen på for eksempel Calone', 'Finn klasseoversikten på Blackboard/Canvas', 'Bli med i klassegruppen på Facebook eller Discord'],
      link: { label: 'Se timeplanen', href: 'https://calone.com' },
    },
  },
  {
    id: 4,
    title: 'Fadderuka',
    shortTitle: 'Fadderuka',
    description: 'Meld deg på og betal for fadderuka',
    icon: PartyPopper,
    content: {
      heading: 'Bli med på fadderuka!',
      body: 'Fadderuka er den beste måten å bli kjent med medstudentene dine på! Her er det sosiale arrangementer gjennom hele uka.',
      tips: [
        'Betal 500 kr via Vipps for å sikre plassen din',
        'Følg med på fadderuka-programmet i TIHLDE-appen',
        'Ta kontakt med fadderne dine om du har spørsmål',
      ],
      showPaymentCard: true,
    },
  },
];

function NewStudent() {
  const [currentStage, setCurrentStage] = useState(1);

  const currentStageData = stages.find((s) => s.id === currentStage);

  return (
    <Page className='max-w-5xl w-full mx-auto space-y-10'>
      <TihldeWelcome />

      <div className='space-y-8'>
        <StepIndicator stages={stages} currentStage={currentStage} onSelectStage={setCurrentStage} />

        {currentStageData && (
          <div key={currentStageData.id}>
            <StepContent stage={currentStageData} totalStages={stages.length} />
          </div>
        )}

        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4'>
          <Button variant='outline' onClick={() => setCurrentStage((prev) => Math.max(1, prev - 1))} disabled={currentStage === 1}>
            <ChevronLeft className='mr-2 h-4 w-4' />
            Tilbake
          </Button>
          <Button
            onClick={() => setCurrentStage((prev) => Math.min(stages.length, prev + 1))}
            disabled={currentStage === stages.length}
            className={currentStage === stages.length ? 'bg-green-600 hover:bg-green-700 text-white' : ''}>
            {currentStage === stages.length ? (
              <>
                <Check className='mr-2 h-4 w-4' />
                Alt er klart! Velkommen!
              </>
            ) : (
              <>
                Neste steg
                <ChevronRight className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>
        </div>
      </div>

      <TihldeInfoCard />
    </Page>
  );
}
