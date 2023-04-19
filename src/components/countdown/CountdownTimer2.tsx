import { addHours } from 'date-fns';
import React, { createContext, useEffect, useState } from 'react';

const CountdownContext = createContext({});

const CountdownProvider: React.FC = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    const endTime = addHours(new Date(), 1);
    const intervalId = setInterval(() => {
      const now = new Date();
      const distance = endTime.getTime() - now.getTime();

      if (distance >= 0) {
        setTimeLeft(Math.floor(distance / 1000));
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <CountdownContext.Provider value={{ timeLeft }}>{children}</CountdownContext.Provider>;
};

const CountDownTimer: React.FC = () => {
  const { timeLeft } = React.useContext(CountdownContext);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CountdownProvider>
      <CountDownTimer />
    </CountdownProvider>
  );
};

export default App;
