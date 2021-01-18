import { FormControl, FormHelperText, InputLabel, Select } from '@material-ui/core';
import React from 'react';
export type DropdownProps = {
  id: string;
  label: string;
  items: string[];
  required?: boolean;
  value: string;
  setValue: (e: React.ChangeEvent<{ value: unknown }>) => void;
  error?: string;
};
const Dropdown = ({ id, required = false, label, items, value, setValue, error }: DropdownProps) => {
  return (
    <FormControl error={Boolean(error)} variant='outlined'>
      <InputLabel id={id}>
        {label} {required && '*'}
      </InputLabel>
      <Select autoWidth id={id} label={label} labelId={id} native onChange={setValue} value={value}>
        <option aria-label='None' value='' />
        {items?.map((item, index) => (
          <option key={index} value={index}>
            {item}
          </option>
        ))}
      </Select>
      {Boolean(error) && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export default Dropdown;
