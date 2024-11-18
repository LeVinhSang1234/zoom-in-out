import { CanvasContextValue } from "./context/canvas";
import { INIT_SCALE, base64Point } from "./conts";
import {
  // Bounds,
  ComponentApp,
  CursorType,
  KEYBOARD_CODE,
  // Point,
  // TypeSelection,
  WindowSize,
  Zoom,
} from "./types";

export const isHoved = (
  contain: { x: number; y: number },
  screen: { x: number; y: number; width: number; height: number }
) => {
  const { x: x1, y: y1, width: w1, height: h1 } = screen;
  const { x: x2, y: y2 } = contain;
  return x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1;
};

//Scale width và height với Zoom. Width height của element draw trong canvas
export const zoomed = (number: number, zoom: Zoom) => {
  const { scale } = zoom;
  return number * scale;
};

// converts from world coord to screen pixel coord
// biến đổi vị trí x ban đầu thành vị trí mới sau khi zoom
export const zoomedX = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  // scale & origin X
  return (number - worldOrigin.x) * scale + screenOrigin.x;
};

// converts from world coord to screen pixel coord
// biến đổi vị trí y ban đầu thành vị trí mới sau khi zoom
export const zoomedY = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  // scale & origin Y
  return (number - worldOrigin.y) * scale + screenOrigin.y;
};

// inverse function converts from screen pixel coord to world coord
// tính toán lại vị trí chuột x so với thực tế sau khi bị translate và zoom xg
export const zoomedX_INV = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number - screenOrigin.x) / scale + worldOrigin.x;
};

// tính toán lại vị trí chuột y so với thực tế sau khi bị translate và zoom xg
export const zoomedY_INV = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number - screenOrigin.y) / scale + worldOrigin.y;
};

// converts from world coord to screen pixel coord
// tính toán lại component
export const makeScreen = (screen: ComponentApp) => {
  const { zoom } = screen;
  return {
    ...screen,
    x: zoomedX(screen.x, zoom),
    y: zoomedY(screen.y, zoom),
    width: zoomed(screen.width, zoom),
    height: zoomed(screen.height, zoom),
  };
};

const onKeydown = (event: KeyboardEvent) => {
  const key = event.key as KEYBOARD_CODE;
  if ([KEYBOARD_CODE.F12, KEYBOARD_CODE.F7].includes(key)) {
    event.preventDefault();
  }
};

export const DisableEventBrowser = () => {
  // eslint-disable-next-line no-new-func
  (document as any).oncontextmenu = new Function("return false");
  document.addEventListener("keydown", onKeydown);
};

export const EnableEventBrowser = () => {
  // eslint-disable-next-line no-new-func
  (document as any).oncontextmenu = undefined;
  document.removeEventListener("keydown", onKeydown);
};

export const getCursor = (type: CursorType) => {
  if (type === CursorType.DEFAULT) {
    return `url("${base64Point}") 4 4, auto !important`;
  }
  return type;
};

export const getSize = (size: WindowSize) => {
  return { width: size.width * INIT_SCALE, height: size.height * INIT_SCALE };
};

export const getConfig = (props: CanvasContextValue): CanvasContextValue => {
  const {
    lineWidth,
    fontSize,
    minZoom,
    maxZoom,
    sizeLineFrame,
    colorBorderHoverElement,
    colorBorderHoverGroup,
    backgroundColor,
    framePixelColor,
    scaleVisibleFrame,
    initScale,
    backgroundColorMenu,
    sizeGridSquare,
    titlePageColor,
    titlePageHoverColor,
  } = props;

  return {
    lineWidth,
    fontSize,
    minZoom,
    maxZoom,
    sizeLineFrame,
    colorBorderHoverElement,
    colorBorderHoverGroup,
    backgroundColor,
    framePixelColor,
    scaleVisibleFrame,
    initScale,
    backgroundColorMenu,
    sizeGridSquare,
    titlePageColor,
    titlePageHoverColor,
  };
};
