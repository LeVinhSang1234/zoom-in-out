import { ComponentType, forwardRef, PropsWithoutRef } from "react";
import { CanvasContextValue, useCanvasContext } from "./canvas";
import { CanvasControlProvider } from "../provider/CanvasControl";

export function withCanvasProvider<T, Type>(
  Component: ComponentType<T & CanvasContextValue>
) {
  return forwardRef<Type, T>((props: T | PropsWithoutRef<T>, ref) => {
    const value = useCanvasContext();

    return (
      <CanvasControlProvider>
        <Component ref={ref} {...value} {...(props as T)} />
      </CanvasControlProvider>
    );
  });
}
