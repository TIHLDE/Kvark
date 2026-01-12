import { createFileRoute } from '@tanstack/react-router';

import { TihldeInfo } from './Components/TihldeInfo';
import Timeline from './Components/timeline';

export const Route = createFileRoute('/_MainLayout/ny-student')({
  component: NewStudent,
});

function NewStudent() {
  return (
    <div className='flex flex-col min-h-screen pt-20 px-4 pb-8'>
      <div className='flex-1 flex flex-col'>
        <Timeline />
      </div>
      <div className='mt-8'>
        <TihldeInfo />
      </div>
    </div>
  );
}
