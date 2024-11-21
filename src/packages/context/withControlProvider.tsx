import { ComponentType, forwardRef, PropsWithoutRef, useContext } from "react";
import { CanvasControlContext, TCanvasControlContext } from "./canvas";

export function withControlProvider<T, Type>(
  Component: ComponentType<T & TCanvasControlContext>
) {
  return forwardRef<Type, T>((props: T | PropsWithoutRef<T>, ref) => {
    const { getControl } = useContext(CanvasControlContext);
    return <Component ref={ref} {...(props as T)} getControl={getControl} />;
  });
}
