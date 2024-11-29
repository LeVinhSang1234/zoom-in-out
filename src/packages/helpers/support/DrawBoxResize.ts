import { ComponentApp, ModeResize } from "../../types";
import { checkModeResize, zoomed, zoomedX, zoomedY } from "../../utlis";
import { DrawSquareResize } from "./DrawSquareResize";

export const DrawBoxResize = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp
) => {
  const { zoom, config, cursor, id, x, y, width, height } = screen;
  const { lineWidth, isPressSpace } = config;
  const { selection, hover } = config.getControl();
  const { modeResize, cursorDowning, sizeBegin } = cursor.getApp();
  const isSelection = selection[0] === id;
  const isHover = (hover === id && !modeResize) || (modeResize && isSelection);

  if (!isHover && !isSelection) return;

  if (isSelection && !isPressSpace) {
    const mode = checkModeResize(screen);
    if (!cursorDowning && mode !== modeResize) cursor.triggerModeResize(mode);
    if (!sizeBegin && !mode && modeResize === ModeResize.DRAG_DROP) {
      cursor.triggerModeResize(ModeResize.DRAG_DROP);
    }
  }

  ctx.save();
  const _x = zoomedX(x, zoom);
  const _y = zoomedY(y, zoom);
  const _width = zoomed(width, zoom);
  const _height = zoomed(height, zoom);
  ctx.strokeStyle = config.colorBorderHoverGroup;
  const lineW = lineWidth + (isHover ? 1 : 0);
  const half = lineW / 2;
  ctx.lineWidth = lineW;
  ctx.strokeRect(_x - half, _y - half, _width + lineW, _height + lineW);
  ctx.restore();

  if (isSelection) {
    DrawSquareResize(ctx, screen);
  }
};
