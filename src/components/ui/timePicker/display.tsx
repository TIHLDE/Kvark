import { Clock } from "lucide-react";
import { useRef } from "react";
import { Label } from "../label";
import { TimePickerInput } from "./input";
import { cn } from "lib/utils";

interface TimePickerDisplayProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  hideSeconds?: boolean;
}

export function TimePickerDisplay({ date, setDate, className, hideSeconds }: TimePickerDisplayProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Timer
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutter
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      {!hideSeconds && (<div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Sekunder
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>)}
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}