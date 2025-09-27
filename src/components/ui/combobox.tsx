import { Combobox as BaseCombobox } from '@base-ui-components/react/combobox';
import { cn } from '~/lib/utils';
import * as React from 'react';
import { forwardRef } from 'react';

import styles from './index.module.css';

type ComboboxProps = React.ComponentPropsWithoutRef<typeof BaseCombobox.Root>;

function Combobox(props: ComboboxProps) {
  return <BaseCombobox.Root {...props} />;
}
Combobox.displayName = 'Combobox';

const ComboboxInput = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof BaseCombobox.Input>>(({ className, ...props }, ref) => {
  return (
    <BaseCombobox.Input
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
ComboboxInput.displayName = 'ComboboxInput';

export { Combobox, ComboboxInput };

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Input.displayName = "Input"

export default function ExampleCombobox() {
  const id = React.useId();
  return (
    <BaseCombobox.Root items={fruits}>
      <div className={styles.Label}>
        <label htmlFor={id}>Choose a fruit</label>
        <div className={styles.InputWrapper}>
          <BaseCombobox.Input placeholder='e.g. Apple' id={id} className={styles.Input} />
          <div className={styles.ActionButtons}>
            <BaseCombobox.Clear className={styles.Clear} aria-label='Clear selection'>
              <ClearIcon className={styles.ClearIcon} />
            </BaseCombobox.Clear>
            <BaseCombobox.Trigger className={styles.Trigger} aria-label='Open popup'>
              <ChevronDownIcon className={styles.TriggerIcon} />
            </BaseCombobox.Trigger>
          </div>
        </div>
      </div>

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className={styles.Positioner} sideOffset={4}>
          <BaseCombobox.Popup className={styles.Popup}>
            <BaseCombobox.Empty className={styles.Empty}>No fruits found.</BaseCombobox.Empty>
            <BaseCombobox.List className={styles.List}>
              {(item: string) => (
                <BaseCombobox.Item key={item} value={item} className={styles.Item}>
                  <BaseCombobox.ItemIndicator className={styles.ItemIndicator}>
                    <CheckIcon className={styles.ItemIndicatorIcon} />
                  </BaseCombobox.ItemIndicator>
                  <div className={styles.ItemText}>{item}</div>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill='currentcolor' width='10' height='10' viewBox='0 0 10 10' {...props}>
      <path d='M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z' />
    </svg>
  );
}

function ClearIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}>
      <path d='M18 6L6 18' />
      <path d='M6 6l12 12' />
    </svg>
  );
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}>
      <path d='M6 9l6 6 6-6' />
    </svg>
  );
}

const fruits = [
  'Apple',
  'Banana',
  'Orange',
  'Pineapple',
  'Grape',
  'Mango',
  'Strawberry',
  'Blueberry',
  'Raspberry',
  'Blackberry',
  'Cherry',
  'Peach',
  'Pear',
  'Plum',
  'Kiwi',
  'Watermelon',
  'Cantaloupe',
  'Honeydew',
  'Papaya',
  'Guava',
  'Lychee',
  'Pomegranate',
  'Apricot',
  'Grapefruit',
  'Passionfruit',
];
