import { ComponentType, forwardRef, PropsWithoutRef } from "react";
import { CanvasContextValue, useCanvasContext } from "./canvas";
import { TCanvasControlContext, useCanvasControl } from "./CanvasControl";
import { ComponentBase } from "../types";

export function withCanvasProvider<T, Type>(
  Component: ComponentType<T & CanvasContextValue & TCanvasControlContext>
) {
  return forwardRef<Type, T>((props: T | PropsWithoutRef<T>, ref) => {
    const value = useCanvasContext();
    const valueControl = useCanvasControl();
    let components: ComponentBase[] = (props as any).components
    if (!components?.length && valueControl.components?.length) {
      components = valueControl.components
    }
    return <Component ref={ref}  {...props as T} {...value} {...valueControl} components={components} />;
  });
}
