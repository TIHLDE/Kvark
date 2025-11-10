export const TihldeInfo = () => {
  const infoTextFirst = 'TIHLDE er Trondheim Ingeniørhøgskoles Linjeforening for Dannede EDBere.';
  const infoTextSecond =
    'Vi er en linjeforening som jobber for å få en bedre studieopplevelse for alle våre EDBere, og verdsetter god stemning minst like mye som gode karakterer!';

  return (
    <div className='mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
      <h3 className='text-xl font-semibold mb-2'>Hva er egentlig TIHLDE</h3>
      <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-3'>{infoTextFirst}</p>
      <p className='text-slate-700 dark:text-slate-300 leading-relaxed mb-3'>{infoTextSecond}</p>
      <a href='https://wiki.tihlde.org/' target='_blank' rel='noopener noreferrer' className='text-blue-600 dark:text-blue-400 hover:underline font-medium'>
        Besøk TIHLDEs wiki →
      </a>
    </div>
  );
};
