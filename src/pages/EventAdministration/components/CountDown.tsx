import { differenceInMilliseconds, formatDistanceStrict, minutesToMilliseconds } from "date-fns";
import { nb } from "date-fns/locale";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert';

interface CountDownProps {
    expiredate: Date;
};
const getTimeDifference = (time: Date) => {
    const now = new Date();
    const myDate = new Date(time);
  
    // Add 10 minutes so that the user has time to pay
    const addedTime = minutesToMilliseconds(10);
  
    return differenceInMilliseconds(new Date(myDate.getTime() + addedTime), now);
  };
  
  const convertTime = (milliseconds: number) => {
    const now = new Date();
  
    return formatDistanceStrict(new Date(now.getTime() + milliseconds), now, {
      locale: nb,
    });
  };
const CountDown = ({expiredate}:CountDownProps) => {
    // Remove 10 minutes for displaying the actual time left
    const removedTime = minutesToMilliseconds(10);
    const [timeLeft, setTimeLeft] = useState(convertTime(getTimeDifference(expiredate) - removedTime));
    useEffect(() => {
        if (new Date(expiredate) < new Date()) {
          return;
        }
    
        const interval = setInterval(() => {
          const distance = getTimeDifference(expiredate);
    
          if (distance && distance > 0) {
            setTimeLeft(convertTime(distance - removedTime));
          } else {
            setTimeLeft("0"); 
          }
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
      }, []);

      return (
        <div>
          <div className="relative w-full rounded-lg border py-4 px-6 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground text-warning border-warning [&>svg]:text-warning">
                <Info className='w-5 h-5' />
                <h1 className="text-[#663C00] dark:text-[#FFE2B8]">
                  Brukeren har {timeLeft} igjen på å betale.
                </h1>
              </div>
        
        
        </div>
        
      )
}
export default CountDown;