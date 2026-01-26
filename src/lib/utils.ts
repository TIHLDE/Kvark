import { HTMLProps, useRender } from '@base-ui/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type useRenderAsChildProp<ElementType extends React.ElementType, State = object, RenderFunctionProps = HTMLProps> = useRender.ComponentProps<
  ElementType,
  State,
  RenderFunctionProps
> & {
  asChild?: boolean;
  children?: React.ReactNode;
};

export function useRenderAsChild<State extends Record<string, unknown>, RenderedElementType extends Element, Enabled extends boolean | undefined = undefined>({
  children,
  asChild = false,
  render,
  ...params
}: useRender.Parameters<State, RenderedElementType, Enabled> & { asChild?: boolean; children?: React.ReactNode }): useRender.ReturnValue<Enabled> {
  const finalParams: useRender.Parameters<State, RenderedElementType, Enabled> = {
    ...params,
  };

  if (render != null) {
    finalParams.render = render;
    if (children != null) {
      if (finalParams.props == null) {
        finalParams.props = {};
      }
      finalParams.props.children = children;
    }
  } else if (asChild && children) {
    finalParams.render = children as React.ReactElement;
    if (finalParams.props != null) {
      delete finalParams.props.children;
    }
  } else if (children != null) {
    if (finalParams.props == null) {
      finalParams.props = {};
    }
    finalParams.props.children = children;
  }

  return useRender(finalParams);
}
