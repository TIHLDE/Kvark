export const CLASS_VALUES = ['first', 'second', 'third', 'fourth', 'fifth', 'alumni'] as const;
export const JOB_TYPE_VALUES = ['full_time', 'part_time', 'summer_job', 'other'] as const;

export type ClassValue = (typeof CLASS_VALUES)[number];
export type JobType = (typeof JOB_TYPE_VALUES)[number];

export const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Fulltid',
  part_time: 'Deltid',
  summer_job: 'Sommerjobb',
  other: 'Annet',
};

export const CLASS_LABELS: Record<string, string> = {
  first: '1.',
  second: '2.',
  third: '3.',
  fourth: '4.',
  fifth: '5.',
  alumni: 'Alumni',
};

export const CLASS_OPTIONS: { value: ClassValue; label: string }[] = [
  { value: 'first', label: '1' },
  { value: 'second', label: '2' },
  { value: 'third', label: '3' },
  { value: 'fourth', label: '4' },
  { value: 'fifth', label: '5' },
];

export const JOB_TYPE_OPTIONS = Object.entries(JOB_TYPE_LABELS).map(([value, label]) => ({
  value: value as JobType,
  label,
}));

export const YEAR_OPTIONS: { label: string; value: ClassValue }[] = [
  { label: '1. klasse', value: 'first' },
  { label: '2. klasse', value: 'second' },
  { label: '3. klasse', value: 'third' },
  { label: '4. klasse', value: 'fourth' },
  { label: '5. klasse', value: 'fifth' },
];

export const YEAR_LABELS: Record<string, string> = {
  first: '1. klasse',
  second: '2. klasse',
  third: '3. klasse',
  fourth: '4. klasse',
  fifth: '5. klasse',
  alumni: 'Alumni',
};
