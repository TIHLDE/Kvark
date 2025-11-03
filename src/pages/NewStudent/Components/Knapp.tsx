interface KnappProps {
  tekst: string;
  onClick: () => void;
}

export const gKnapp = ({ tekst, onClick }: KnappProps) => {
  return (
    <button onClick={onClick} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
      {tekst}
    </button>
  );
};
