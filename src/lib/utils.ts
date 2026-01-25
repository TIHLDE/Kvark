import { HTMLProps, useRender } from "@base-ui/react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type RenderParam<ElementType extends React.ElementType> =
  useRender.ComponentProps<ElementType>["render"];

export function useRenderParam<ElementType extends React.ElementType>(
  render: RenderParam<ElementType>,
  asChild: boolean,
  children?: React.ReactNode
): [RenderParam<ElementType>, React.ReactNode | undefined] {
  if (render) {
    return [render, children]
  }

  if (asChild) {
    return [children as React.ReactElement<Record<string, unknown>>, undefined]
  }
  return [undefined, children];
}


export type useRenderAsChildProp<ElementType extends React.ElementType, State = {}, RenderFunctionProps = HTMLProps> = useRender.ComponentProps<ElementType, State, RenderFunctionProps> & {
  asChild?: boolean;
  children?: React.ReactNode;
}

export function useRenderAsChild<
  State extends Record<string, unknown>,
  RenderedElementType extends Element,
  Enabled extends boolean | undefined = undefined
>({ children, asChild = false, render, ...params }: useRender.Parameters<State, RenderedElementType, Enabled> & { asChild?: boolean, children?: React.ReactNode }): useRender.ReturnValue<Enabled> {
  if (render != null) {
    return useRender({
      ...params,
      render,
      props: {
        ...params.props,
        children,
      }
    });
  }
  
  if (asChild && children) {
    const { children: _, ...restProps } = params.props || {};
    
    return useRender({
      ...params,
      render: children as React.ReactElement,
      props: {
        ...restProps,
      }
    });
  }

  return useRender(params);
}
