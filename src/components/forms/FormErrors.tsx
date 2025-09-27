import { StandardSchemaV1Issue } from '@tanstack/react-form';
import { cn } from '~/lib/utils';
import { RequestResponse } from '~/types';
import { ZodError } from 'zod';

import { useFormContext } from './AppForm';

interface FormErrorProps {
  onlyFirst?: boolean;
  className?: string;
}

export function FormErrors({ onlyFirst, className }: FormErrorProps) {
  const formCtx = useFormContext();

  return (
    <formCtx.Subscribe selector={(state) => state.errors}>
      {(error) => {
        const errors = Array.isArray(error) ? error : [error];

        if (onlyFirst) {
          return <RenderError className={className} error={errors[0]} />;
        }
        return errors.map((error, index) => <RenderError key={index} className={className} error={error} />);
      }}
    </formCtx.Subscribe>
  );
}

type ErrorTypes = string | StandardSchemaV1Issue | ZodError | RequestResponse;

export function RenderError({ error, className }: { error?: ErrorTypes; className?: string }) {
  const spanClassName = cn('text-sm text-destructive', className);

  if (!error) {
    return undefined;
  }

  if (typeof error === 'string') {
    return <span className={spanClassName}>{error}</span>;
  }

  if (error instanceof ZodError) {
    return <span className={spanClassName}>{error.message}</span>;
  }

  if (typeof error === 'object' && 'message' in error && error.message) {
    return <span className={spanClassName}>{error.message}</span>;
  }
  if (typeof error === 'object' && 'detail' in error && error.detail) {
    return <span className={spanClassName}>{error.detail}</span>;
  }

  return <span className={spanClassName}>{String(error)}</span>;
}
