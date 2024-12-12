import {
  ComponentApp,
  ComponentAppType,
  ModeResize,
  TConfig,
} from "../../types";
import { checkModeResize, zoomed, zoomedX, zoomedY } from "../../utlis";
import { DrawSquareResize } from "./DrawSquareResize";

const DrawBoxResizeChildren = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp,
  parents: ComponentApp[] = []
) => {
  if (!screen?.children?.length) return;
  for (const children of screen.children) {
    DrawBoxResize(ctx, children, [...parents, screen]);
  }
};

const getColorHover = (type: ComponentAppType, config: TConfig) => {
  if (type !== ComponentAppType.TEXT) return config.colorBorderHoverGroup;
  return config.colorBorderHoverElement;
};

export const DrawBoxResize = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp,
  parents: ComponentApp[] = []
) => {
  const { sx, sy } = parents.reduce(
    (a, b) => ({ sx: a.sx + b.x, sy: a.sy + b.y }),
    { sx: 0, sy: 0 }
  );

  const { zoom, config, cursor, id, x, y, width, height } = screen;
  const { lineWidth, isPressSpace } = config;
  const { selection, hover } = config.getControl();
  const { modeResize, cursorDowning, sizeBegin } = cursor.getApp();

  const isSelection = selection[0]?.id === id;
  const { id: _id, parents: _parents = [] } = hover || {};
  const isHover =
    (modeResize && isSelection) ||
    (_id === id && _parents.length < 2 && !modeResize) ||
    (_id !== id && _parents[1]?.id === id && !selection?.length);
  const _pSelect = selection[0]?.parents || [];

  const isDashed = _pSelect.length > 1 && _pSelect.last()?.id === id;
  if (!isHover && !isSelection && !isDashed) {
    return DrawBoxResizeChildren(ctx, screen, parents);
  }

  if (isSelection && !isPressSpace) {
    const mode = checkModeResize(screen);
    if (!cursorDowning && mode !== modeResize) cursor.triggerModeResize(mode);
    if (!sizeBegin && !mode && modeResize === ModeResize.DRAG_DROP) {
      cursor.triggerModeResize(ModeResize.DRAG_DROP);
    }
  }

  ctx.save();
  const _x = zoomedX(x + sx, zoom);
  const _y = zoomedY(y + sy, zoom);
  const _width = zoomed(width, zoom);
  const _height = zoomed(height, zoom);
  ctx.strokeStyle = getColorHover(screen.type, config);
  const lineW = lineWidth + (isHover ? 1 : 0);
  const half = lineW / 2;

  if (isDashed && !isHover) {
    ctx.setLineDash([1, 2]);
  }
  ctx.lineWidth = lineW;
  ctx.strokeRect(_x - half, _y - half, _width + lineW, _height + lineW);
  ctx.restore();

  DrawBoxResizeChildren(ctx, screen, parents);

  if (isSelection) {
    DrawSquareResize(ctx, screen);
  }
};
