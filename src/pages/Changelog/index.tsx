import { createFileRoute } from '@tanstack/react-router';
import InfoCard from '~/components/layout/InfoCard';
import Page from '~/components/navigation/Page';

import ChangelogCard from './components/ChangelogCard';

export const FRONTEND_URL = 'https://raw.githubusercontent.com/TIHLDE/Kvark/master/CHANGELOG.md';
export const BACKEND_URL = 'https://raw.githubusercontent.com/TIHLDE/Lepton/master/CHANGELOG.md';

export const Route = createFileRoute('/_MainLayout/endringslogg')({
  component: Changelog,
});

function Changelog() {
  return (
    <Page>
      <div className='space-y-4 md:space-y-0 md:flex md:items-center md:justify-between mb-4'>
        <div className='space-y-2'>
          <h1 className='text-4xl md:text-5xl font-bold'>Endringslogg</h1>
          <p className='md:text-lg text-muted-foreground'>Changelog på backend og frontend til TIHLDE-siden</p>
        </div>
        <InfoCard header='Tegnforklaring'>
          <div>
            <p>✨ Ny funksjonalitet</p>
            <p>⚡ Forbedret funksjonalitet</p>
            <p>🦟 Fikset en bug</p>
            <p>🎨 Designendringer</p>
          </div>
        </InfoCard>
      </div>
      <div className='gap-4 flex flex-col'>
        <ChangelogCard changelogURL={FRONTEND_URL} title='Hva har vi gjort i frontend?' />
        <ChangelogCard changelogURL={BACKEND_URL} title='Hva har vi gjort i backend?' />
      </div>
    </Page>
  );
}
