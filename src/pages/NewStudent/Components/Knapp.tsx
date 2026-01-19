interface ButtonProps {
  tekst: string;
  onClick: () => void;
}

export const Button = ({ tekst, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
      {tekst}
    </button>
  );
};
