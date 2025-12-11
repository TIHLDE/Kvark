import type { useRender } from "@base-ui-components/react"
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
