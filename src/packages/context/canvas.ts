import { createContext, useContext } from "react";
import {
  FONT_SIZE,
  SIZE_LINE_FRAME,
  LINE_WIDTH,
  MAX_ZOOM,
  MIN_ZOOM,
  COLOR_BORDER_HOVER_GROUP,
  COLOR_BORDER_HOVER_ELEMENT,
  BACKGROUND_COLOR,
  BACKGROUND_COLOR_MENU,
  FRAME_PIXEL_COLOR,
  SCALE_VISIBLE_FRAME,
  INIT_SCALE,
  SIZE_GRID_SQUARE,
  TITLE_PAGE_COLOR,
  TITLE_PAGE_HOVER_COLOR,
  RATIO,
} from "../conts";
import { TitleConfig, TypeSelection } from "../types";

export type CanvasContextValue = {
  lineWidth: number;
  fontSize: number;
  minZoom: number;
  maxZoom: number;
  sizeLineFrame: number;
  colorBorderHoverElement: string;
  colorBorderHoverGroup: string;
  backgroundColor: string;
  backgroundColorMenu: string;
  framePixelColor: string;
  titlePageColor: string;
  titlePageHoverColor: string;
  scaleVisibleFrame: number;
  initScale: number;
  sizeGridSquare: number;
  isSpace?: boolean;
  ratio?: number;
} & TCanvasControlContext;

export const defaultValueContext: CanvasContextValue & TCanvasControlContext = {
  lineWidth: LINE_WIDTH,
  fontSize: FONT_SIZE,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  sizeLineFrame: SIZE_LINE_FRAME,
  colorBorderHoverGroup: COLOR_BORDER_HOVER_GROUP,
  colorBorderHoverElement: COLOR_BORDER_HOVER_ELEMENT,
  backgroundColor: BACKGROUND_COLOR,
  backgroundColorMenu: BACKGROUND_COLOR_MENU,
  framePixelColor: FRAME_PIXEL_COLOR,
  scaleVisibleFrame: SCALE_VISIBLE_FRAME,
  initScale: INIT_SCALE,
  sizeGridSquare: SIZE_GRID_SQUARE,
  titlePageColor: TITLE_PAGE_COLOR,
  titlePageHoverColor: TITLE_PAGE_HOVER_COLOR,
  ratio: RATIO,
  getControl: () => initControl,
};

export const CanvasContext =
  createContext<CanvasContextValue>(defaultValueContext);

export const useCanvasContext = () => useContext(CanvasContext);

export type TitleReq = { id: string; config: TitleConfig };

export type TCanvasControl = {
  selection: TypeSelection[];
  titleHover?: TitleReq;
  hover?: string[];
  titleEdited?: { id: string; input?: HTMLInputElement };
  setSelection: (selection: TypeSelection[]) => void;
  setTitleHover: (req: TitleReq) => void;
  setTitleEdited: (id: string) => void;
  removeTitleEdited: (id: string) => void;
  setHover: (id: string) => void;
  removeHover: (id: string) => void;
  removeTitleHover: (id: string) => void;
};

export type TCanvasControlContext = {
  getControl: () => TCanvasControl;
};

export const initControl: TCanvasControl = {
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
  removeTitleEdited: () => undefined,
};

export const CanvasControlContext = createContext<TCanvasControlContext>({
  getControl: () => initControl,
});
