import { CanvasContextValue } from "./context/canvas";
import { base64Point, RATIO } from "./conts";
import {
  ComponentApp,
  CursorType,
  KEYBOARD_CODE,
  Pointer,
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

export const unZoomed = (number: number, zoom: Zoom) => {
  const { scale } = zoom;
  return number / scale;
};

// converts from world coord to screen pixel coord
// biến đổi vị trí x ban đầu thành vị trí mới sau khi zoom
export const zoomedX = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  // scale & origin X
  return (number - worldOrigin.x) * scale + screenOrigin.x;
};

export const unZoomedX = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number + worldOrigin.x * scale - screenOrigin.x) / scale;
};

// converts from world coord to screen pixel coord
// biến đổi vị trí y ban đầu thành vị trí mới sau khi zoom
export const zoomedY = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  // scale & origin Y
  return (number - worldOrigin.y) * scale + screenOrigin.y;
};

export const unZoomedY = (number: number, zoom: Zoom) => {
  const { worldOrigin, screenOrigin, scale } = zoom;
  return (number + worldOrigin.y * scale - screenOrigin.y) / scale;
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
export const makeScreen = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp
) => {
  const { zoom, config } = screen;
  screen.x = zoomedX(screen.x, zoom);
  screen.y = zoomedY(screen.y, zoom);
  screen.width = zoomed(screen.width, zoom);
  screen.height = zoomed(screen.height, zoom);
  makeTitle(ctx, screen);
  screen.cursor = {
    inTitle: () => {
      if (config.isSpace) return false;
      return isHoved(zoom.mouse, {
        width: screen.titleConfig.width,
        height: screen.titleConfig.heightCanvas,
        x: screen.titleConfig.xCanvas,
        y: screen.titleConfig.y,
      });
    },
    inScreen: () => {
      if (config.isSpace) return false;
      const isHovePage = isHoved(zoom.mouse, screen);
      return isHovePage;
    },
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

export const getSize = (size: WindowSize, ratio: number) => {
  return {
    width: size.width * ratio,
    height: size.height * ratio,
  };
};

export const getMaxWidthSize = (
  components: (WindowSize & Pointer)[],
  scale: number
) => {
  return Math.max(...components.map((e) => e.x + e.width)) * scale;
};

export const getMaxHeightSize = (
  components: (WindowSize & Pointer)[],
  scale: number
) => {
  return Math.max(...components.map((e) => e.y + e.height)) * scale;
};

export const getConfig = (
  props: CanvasContextValue & { layout: WindowSize }
): CanvasContextValue & { layout: WindowSize } => {
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
    isSpace,
    layout,
    getControl,
    ratio,
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
    getControl,
    isSpace,
    layout,
    ratio,
  };
};

export const clsx = (...args: any[]) => {
  return args
    .filter((e) => typeof e === "string" && !!e?.trim())
    .join(" ")
    .trim();
};

const SUB = 9;
export const makeTitle = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp
) => {
  const { width, x, y, name, title, config } = component;
  const { fontSize, ratio = RATIO } = config;
  let text = title || name;
  ctx.save();
  ctx.font = `400 ${fontSize * ratio}px Inter, sans-serif`;
  let textWidth = ctx.measureText(text).width;
  if (textWidth > width) {
    const ellipsis = "...";
    let truncatedText = text.slice(0, -1);
    while (
      truncatedText.length > 1 &&
      ctx.measureText(truncatedText + ellipsis).width > width
    ) {
      truncatedText = truncatedText.slice(0, -1);
    }
    text = truncatedText + ellipsis;
  }
  const height = fontSize * ratio;
  const yText = y - SUB * ratio;
  textWidth = ctx.measureText(text).width;
  if (textWidth > width) {
    text = "...";
    textWidth = width;
  }
  ctx.restore();
  component.titleConfig = {
    x,
    y: yText - height,
    xCanvas: x,
    yCanvas: yText,
    width: textWidth,
    height,
    heightCanvas: height + SUB * ratio,
    fontSize: fontSize * ratio,
    text,
    fullText: text,
  };
};
