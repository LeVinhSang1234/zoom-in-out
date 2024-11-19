import { TitleConfig, TypeSelection } from "../types";
import { ComponentType, forwardRef, createContext, useContext } from "react";

export type TitleReq = { id: string; config: TitleConfig };

export type TCanvasControl = {
  selection: TypeSelection[];
  titleHover?: TitleReq;
  hover?: string[];
  titleEdited?: TitleReq;
  setSelection: (selection: TypeSelection[]) => void;
  setTitleHover: (req: TitleReq) => void;
  setTitleEdited: (req: TitleReq) => void;
  setHover: (id: string) => void;
  removeHover: (id: string) => void;
  removeTitleHover: (id: string) => void;
};

export type TCanvasControlContext = {
  getControl: () => TCanvasControl;
};

export const CanvasControlContext = createContext<TCanvasControlContext>({
  getControl: () => ({
    selection: [],
    titleHover: undefined,
    titleEdited: undefined,
    hover: [],
    setHover: () => undefined,
    removeHover: () => undefined,
    setSelection: () => undefined,
    setTitleHover: () => undefined,
    setTitleEdited: () => undefined,
    removeTitleHover: () => undefined,
  }),
});

export const CanvasControlProvider = CanvasControlContext.Provider;

export function withControlProvider<T, Type>(
  Component: ComponentType<T & TCanvasControlContext>
) {
  return forwardRef<Type, T>((props: T, ref) => {
    const { getControl } = useContext(CanvasControlContext);
    return <Component ref={ref} {...props} getControl={getControl} />;
  });
}
