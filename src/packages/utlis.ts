import { base64Point, RATIO, SIZE_BOX_RESIZE } from "./conts";
import {
  CanvasContextValue,
  ComponentApp,
  ComponentCursor,
  CursorType,
  KEYBOARD_CODE,
  ModeResize,
  Pointer,
  TitleConfig,
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

export const configCursor = (screen: ComponentApp) => {
  const { zoom, config } = screen;
  screen.cursor = {
    inTitle: () => {
      if (config.isPressSpace) return false;
      return isHoved(zoom.mouse, {
        width: screen.titleConfig.width,
        height: screen.titleConfig.heightCanvas,
        x: screen.titleConfig.xCanvas,
        y: screen.titleConfig.y,
      });
    },
    inScreen: () => {
      if (config.isPressSpace) return false;
      const isHovePage = isHoved(zoom.mouse, {
        width: zoomed(screen.width, screen.zoom),
        height: zoomed(screen.height, screen.zoom),
        x: zoomedX(screen.x, screen.zoom),
        y: zoomedY(screen.y, screen.zoom),
      });
      return isHovePage;
    },
  } as ComponentCursor;
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
    titlePageColor,
    titlePageHoverColor,
    isPressSpace,
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
    titlePageColor,
    titlePageHoverColor,
    getControl,
    isPressSpace,
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
  screen: ComponentApp
) => {
  const { width, x, y, title, config, zoom } = screen;

  const _x = zoomedX(x, zoom);
  const _y = zoomedY(y, zoom);
  const _width = zoomed(width, zoom);

  const { fontSize, ratio = RATIO } = config;
  let text = title || "";
  ctx.save();
  ctx.font = `400 ${fontSize * ratio}px Inter, sans-serif`;
  let textWidth = ctx.measureText(text).width;
  if (textWidth > _width) {
    const ellipsis = "...";
    let truncatedText = text.slice(0, -1);
    while (
      truncatedText.length > 1 &&
      ctx.measureText(truncatedText + ellipsis).width > _width
    ) {
      truncatedText = truncatedText.slice(0, -1);
    }
    text = truncatedText + ellipsis;
  }
  const height = fontSize * ratio;
  const yText = _y - SUB * ratio;
  textWidth = ctx.measureText(text).width;
  if (textWidth > _width) {
    text = "...";
    textWidth = _width;
  }
  ctx.restore();
  screen.titleConfig = {
    x: _x,
    y: yText - height,
    xCanvas: _x,
    yCanvas: yText,
    width: textWidth,
    height,
    heightCanvas: height + SUB * ratio,
    fontSize: fontSize * ratio,
    text,
    fullText: title || "Frame",
  } as TitleConfig;
};

export const textToWidth = (
  ctx: CanvasRenderingContext2D,
  text: string,
  config: {
    fontSize: number;
    ratio: number;
  }
) => {
  ctx.save();
  ctx.font = `400 ${config.fontSize * config.ratio}px Inter, sans-serif`;
  const width = ctx.measureText(text).width;
  ctx.restore();
  return width;
};

export const checkModeResize = (
  screen: ComponentApp
): ModeResize | undefined => {
  const { x, y, width, height, zoom, config } = screen;
  const { sizeBoxResize = SIZE_BOX_RESIZE } = config;
  const _x = zoomedX(x, zoom);
  const _y = zoomedY(y, zoom);
  const _w = zoomed(width, zoom);
  const _h = zoomed(height, zoom);
  const sc = { x: _x, y: _y, width: _w, height: _h };
  const { mouse } = zoom;

  const size = sizeBoxResize + 4;
  const box = { width: size, height: size };
  const hafl = sizeBoxResize / 2;

  let mode: ModeResize | undefined;
  if (isHoved(mouse, { ...box, x: _x - hafl, y: _y - hafl })) {
    mode = ModeResize.TOP_LEFT;
  } else if (isHoved(mouse, { ...box, x: _x - hafl + _w, y: _y - hafl })) {
    mode = ModeResize.TOP_RIGHT;
  } else if (isHoved(mouse, { ...box, x: _x - hafl + _w, y: _y - hafl + _h })) {
    mode = ModeResize.BOTTOM_RIGHT;
  } else if (isHoved(mouse, { ...box, x: _x - hafl, y: _y - hafl + _h })) {
    mode = ModeResize.BOTTOM_LEFT;
  } else if (isHoved(mouse, { ...sc, y: _y - 4, height: 8 })) {
    mode = ModeResize.TOP;
  } else if (isHoved(mouse, { ...sc, x: _x - 4, width: 8 })) {
    mode = ModeResize.LEFT;
  } else if (isHoved(mouse, { ...sc, x: _x + _w - 4, width: 8 })) {
    mode = ModeResize.RIGHT;
  } else if (isHoved(mouse, { ...sc, y: _y + _h - 4, height: 8 })) {
    mode = ModeResize.BOTTOM;
  }
  return mode;
};

export const addClass = (
  element: HTMLElement | null | undefined,
  className: string
) => {
  if (!element) return;
  if (element.className.includes(className)) return;
  element.className += ` ${className}`;
};

export const removeClass = (
  element: HTMLElement | null | undefined,
  className: string
) => {
  if (!element) return;
  if (!element.className.includes(className)) return;
  element.className = element.className.replaceAll(className, "").trim();
};

export const changeClass = (
  element: HTMLElement | null | undefined,
  className: string
) => {
  if (!element) return;
  element.className = className;
};
