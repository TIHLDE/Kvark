interface InfoMenuProps {
  title?: string;
  text?: string;
  stageId?: number;
  stageTexts?: Record<number, string>;
}

const InfoMenu: React.FC<InfoMenuProps> = ({ title, text, stageId, stageTexts }) => {
  const displayText = text ?? (stageId !== undefined && stageTexts ? (stageTexts[stageId] ?? 'To be continued') : 'To be continued');

  return (
    <div className='mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
      {title && <h3 className='text-xl font-semibold mb-2'>{title}</h3>}
      <p className='text-slate-700 dark:text-slate-300 leading-relaxed'>{displayText}</p>
    </div>
  );
};

export default InfoMenu;
