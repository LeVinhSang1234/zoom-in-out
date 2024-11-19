import { ComponentType, forwardRef, useCallback, useRef } from "react";
import { CanvasContextValue, useCanvasContext } from "./canvas";
import {
  CanvasControlProvider,
  TCanvasControl,
  TitleReq,
} from "./CanvasControl";
import { TypeSelection } from "../types";

export function withCanvasProvider<T, Type>(
  Component: ComponentType<T & CanvasContextValue>
) {
  return forwardRef<Type, T>((props: T, ref) => {
    const value = useCanvasContext();

    const selection = useRef<TypeSelection[]>([]);
    const hover = useRef<string[]>([]);
    const title = useRef<TitleReq>();
    const titleEdited = useRef<TitleReq>();

    const setSelection = useCallback((_selection: TypeSelection[]) => {
      selection.current = _selection;
    }, []);

    const setTitleHover = useCallback((req: TitleReq) => {
      title.current = req;
    }, []);

    const setTitleEdited = useCallback((req: TitleReq) => {
      titleEdited.current = req;
    }, []);

    const removeTitleHover = useCallback((id: string) => {
      if (title.current?.id === id) title.current = undefined;
    }, []);

    const setHover = useCallback((id: string) => {
      if (hover.current.includes(id)) return;
      hover.current.push(id);
    }, []);

    const removeHover = useCallback((id: string) => {
      hover.current = hover.current.filter((e) => e !== id);
    }, []);

    const getControl = useCallback((): TCanvasControl => {
      return {
        hover: hover.current,
        selection: selection.current,
        titleHover: title.current,
        titleEdited: titleEdited.current,
        setHover,
        removeHover,
        setSelection,
        setTitleHover,
        removeTitleHover,
        setTitleEdited,
      };
    }, [
      setHover,
      removeHover,
      setSelection,
      setTitleHover,
      removeTitleHover,
      setTitleEdited,
    ]);

    return (
      <CanvasControlProvider value={{ getControl }}>
        <Component ref={ref} {...value} {...props} />
      </CanvasControlProvider>
    );
  });
}
