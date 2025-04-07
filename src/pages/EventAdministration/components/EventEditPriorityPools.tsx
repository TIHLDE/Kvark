import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '~/components/ui/command';
import { useGroupsByType } from '~/hooks/Group';
import type { BaseGroup, GroupList, PriorityPoolMutate } from '~/types';
import { GroupType } from '~/types/Enums';
import { Command as CommandPrimitive } from 'cmdk';
import { Trash, X } from 'lucide-react';
import { Fragment, useCallback, useMemo, useRef, useState } from 'react';

export type EventEditPriorityPoolsProps = {
  priorityPools: Array<PriorityPoolMutate>;
  setPriorityPools: React.Dispatch<React.SetStateAction<PriorityPoolMutate[]>>;
};
type GroupOption = { type: 'header'; header: string } | { type: 'group'; group: BaseGroup };

const EventEditPriorityPools = ({ priorityPools, setPriorityPools }: EventEditPriorityPoolsProps) => {
  const { BOARD_GROUPS, SUB_GROUPS, COMMITTEES, INTERESTGROUPS, STUDYGROUPS, STUDYYEARGROUPS, data = [] } = useGroupsByType();

  const addPriorityPool = () => setPriorityPools((prev) => [...prev, { groups: [] }]);
  const removePriorityPool = (index: number) => setPriorityPools((prev) => prev.filter((_, i) => i !== index));

  const groupOptions = useMemo<Array<GroupOption>>(() => {
    const array: Array<GroupOption> = [];
    if (BOARD_GROUPS.length) {
      array.push({ type: 'header', header: 'Hovedorgan' });
      BOARD_GROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (SUB_GROUPS.length) {
      array.push({ type: 'header', header: 'Undergrupper' });
      SUB_GROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (COMMITTEES.length) {
      array.push({ type: 'header', header: 'Komitéer' });
      COMMITTEES.forEach((group) => array.push({ type: 'group', group }));
    }
    if (INTERESTGROUPS.length) {
      array.push({ type: 'header', header: 'Interessegrupper' });
      INTERESTGROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (STUDYGROUPS.length) {
      array.push({ type: 'header', header: 'Studier' });
      STUDYGROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    if (STUDYYEARGROUPS.length) {
      array.push({ type: 'header', header: 'Kull' });
      STUDYYEARGROUPS.forEach((group) => array.push({ type: 'group', group }));
    }
    return array;
  }, [BOARD_GROUPS, COMMITTEES, INTERESTGROUPS, SUB_GROUPS, STUDYGROUPS, STUDYYEARGROUPS]);

  return (
    <div className='space-y-2'>
      {priorityPools.map((pool, poolIndex) => (
        <div className='flex space-x-2' key={poolIndex}>
          <MultiSelectGroup data={data} groupOptions={groupOptions} key={poolIndex} pool={pool} poolIndex={poolIndex} setPriorityPools={setPriorityPools} />

          <Button onClick={() => removePriorityPool(poolIndex)} size='icon' type='button' variant='outline'>
            <Trash className='w-4 h-4' />
          </Button>
        </div>
      ))}

      <Button className='w-full' onClick={addPriorityPool} type='button'>
        Legg til prioriteringsgruppe
      </Button>
    </div>
  );
};

type MultiSelectGroupProps = {
  pool: PriorityPoolMutate;
  setPriorityPools: React.Dispatch<React.SetStateAction<Array<PriorityPoolMutate>>>;
  groupOptions: Array<GroupOption>;
  poolIndex: number;
  data: GroupList[];
};

const MultiSelectGroup = ({ pool, setPriorityPools, groupOptions, poolIndex, data }: MultiSelectGroupProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<Array<GroupOption>>(groupOptions);

  const addGroupToPriorityPool = (group: BaseGroup, poolIndex: number) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      const index = newOptions.findIndex((option) => option.type === 'group' && option.group.slug === group.slug);
      if (index !== -1) {
        newOptions.splice(index, 1);
      }
      return newOptions;
    });

    setPriorityPools((prev) => {
      const newPools = [...prev];
      newPools[poolIndex].groups.push(group.slug);
      return newPools;
    });
  };

  const removeGroupFromPriorityPool = (slug: string, poolIndex: number) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      const group = data.find((group) => group.slug === slug);
      if (group) {
        newOptions.push({ type: 'group', group });
      }
      return newOptions;
    });

    setPriorityPools((prev) => {
      const newPools = [...prev];
      newPools[poolIndex].groups = newPools[poolIndex].groups.filter((group) => group !== slug);
      return newPools;
    });
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          setPriorityPools((prev) => {
            const newPools = [...prev];
            newPools[poolIndex].groups.pop();
            return newPools;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  }, []);

  const getGroupName = (slug: BaseGroup['slug']) => {
    const group = data.find((group) => group.slug === slug);
    return group ? (group.type === GroupType.STUDYYEAR ? `${group.name}-kullet` : group.name) : 'Ukjent';
  };

  return (
    <Command className='overflow-visible bg-transparent' key={poolIndex} onKeyDown={handleKeyDown}>
      <div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
        <div className='flex flex-wrap gap-1'>
          {pool.groups.map((slug, index) => (
            <Badge key={index} variant='secondary'>
              {getGroupName(slug)}
              <button
                className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                onClick={() => removeGroupFromPriorityPool(slug, poolIndex)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                type='button'>
                <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
              </button>
            </Badge>
          ))}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            className='ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onValueChange={setInputValue}
            placeholder='Select frameworks...'
            ref={inputRef}
            value={inputValue}
          />
        </div>
      </div>
      <div className='relative mt-2'>
        <CommandList>
          {open && options.length > 0 ? (
            <div className='w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
              <CommandGroup className='h-full overflow-auto'>
                {options.map((option, index) => (
                  <Fragment key={index}>
                    {option.type === 'header' ? (
                      <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-semibold'>
                        <p>{option.header}</p>
                      </div>
                    ) : (
                      <CommandItem
                        className={'cursor-pointer'}
                        key={index}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          setInputValue('');
                          addGroupToPriorityPool(option.group, poolIndex);
                        }}>
                        {getGroupName(option.group.slug)}
                      </CommandItem>
                    )}
                  </Fragment>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
};

export default EventEditPriorityPools;
