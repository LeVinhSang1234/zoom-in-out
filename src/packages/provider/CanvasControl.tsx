import { CanvasControlContext, TCanvasControl } from "../context/canvas";
import { TitleReq } from "../types";
import { PropsWithChildren, useCallback, useRef } from "react";

export const CanvasControlProvider = ({ children }: PropsWithChildren) => {
  const selection = useRef<string[]>([]);
  const hover = useRef<string[]>([]);
  const title = useRef<TitleReq>();
  const titleEdited = useRef<{ id: string; input?: HTMLInputElement }>();

  const setSelection = useCallback((_selection: string[]) => {
    selection.current = _selection;
  }, []);

  const setTitleHover = useCallback((req: TitleReq) => {
    title.current = req;
  }, []);

  const setTitleEdited = useCallback((id: string) => {
    titleEdited.current = { id };
  }, []);

  const removeTitleEdited = useCallback((id: string) => {
    if (titleEdited.current?.id === id) {
      if (titleEdited.current.input) {
        document.body.removeChild(titleEdited.current.input);
      }
      titleEdited.current = undefined;
    }
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
      removeTitleEdited,
    };
  }, [
    setHover,
    removeHover,
    setSelection,
    setTitleHover,
    removeTitleHover,
    setTitleEdited,
    removeTitleEdited,
  ]);
  return (
    <CanvasControlContext.Provider value={{ getControl }}>
      {children}
    </CanvasControlContext.Provider>
  );
};
