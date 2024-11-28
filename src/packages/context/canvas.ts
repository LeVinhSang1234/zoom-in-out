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
  TITLE_PAGE_COLOR,
  TITLE_PAGE_HOVER_COLOR,
  RATIO,
  SIZE_BOX_RESIZE,
  COLOR_GUIDE_LINE,
  GUIDE_LINE_DISTANCE,
} from "../conts";
import {
  CanvasContextValue,
  TCanvasControl,
  TCanvasControlContext,
} from "../types";

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
  titlePageColor: TITLE_PAGE_COLOR,
  titlePageHoverColor: TITLE_PAGE_HOVER_COLOR,
  ratio: RATIO,
  sizeBoxResize: SIZE_BOX_RESIZE,
  colorGuideLine: COLOR_GUIDE_LINE,
  guideLineDistance: GUIDE_LINE_DISTANCE,
  getControl: () => initControl,
};

export const CanvasContext =
  createContext<CanvasContextValue>(defaultValueContext);

export const useCanvasContext = () => useContext(CanvasContext);

export const initControl: TCanvasControl = {
  selection: [],
  titleHover: undefined,
  titleEdited: undefined,
  hover: undefined,
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
