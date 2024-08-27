import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from 'lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-card dark:bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-10 md:h-11 rounded-md px-5 md:px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

type PaginateButtonProps = {
  nextPage: () => void;
  isLoading?: boolean;
  label?: string;
  className?: string;
};

const PaginateButton = ({
  nextPage,
  isLoading,
  label = 'Last inn mer',
  className
}: PaginateButtonProps) => {
  return (
    <Button
      onClick={nextPage}
      disabled={isLoading}
      variant='secondary'
      className={className}
    >
      { isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
      { label }
    </Button>
  );
};

type GoBackButton = {
  url: string;
};

const GoBackButton = ({ url }: GoBackButton) => {
  return (
    <Button
      asChild
      className='text-black dark:text-white'
      variant='ghost'
      size='icon'
    >
      <Link to={url}>
        <ArrowLeft className='w-6 h-6' />
      </Link>
    </Button>
  );
};

export { Button, buttonVariants, PaginateButton, GoBackButton }
