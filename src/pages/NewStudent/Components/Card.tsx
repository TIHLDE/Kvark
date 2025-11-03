interface CardProps {
  tittel: string;
  beskrivelse: string;
  kroner: number;
}

export const GCard = ({ tittel, beskrivelse, kroner }: CardProps) => {
  return (
    <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow p-6 md:p-8'>
      <div className='flex items-start justify-between gap-4'>
        <h2 className='text-2xl font-semibold tracking-tight'>{tittel}</h2>
        <span className='inline-flex items-center rounded-full bg-sky-100 text-sky-900 dark:bg-sky-800 dark:text-sky-100 ring-1 ring-sky-200 dark:ring-sky-700 px-4 py-1.5 text-base md:text-lg font-semibold'>
          {kroner} kr
        </span>
      </div>
      <p className='mt-3 text-slate-600 dark:text-slate-300 leading-relaxed'>{beskrivelse}</p>
    </div>
  );
};

export default GCard;
