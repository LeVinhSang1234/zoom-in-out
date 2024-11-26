import { ComponentApp } from "../types";
import { checkModeResize, zoomed, zoomedX, zoomedY } from "../utlis";
import { DrawSquareResize } from "./DrawSquareResize";

export const DrawBoxResize = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp
) => {
  const { zoom, config, x, y, width, height, cursor, id } = screen;
  const { lineWidth, initScale, colorBorderHoverGroup, getControl, isSpace } =
    config;
  const { selection } = getControl();

  const isHoverScreen = cursor.inScreen();
  const isHoverTitle = cursor.inTitle();
  const isHover = isHoverScreen || isHoverTitle;
  const isSelection = selection[0] === id;
  if (!isHover && !isSelection) return;

  if (isSelection && !isSpace) {
    const mode = checkModeResize(screen);
    cursor.setModeResize(mode);
  }

  ctx.save();
  ctx.beginPath();
  const _x = zoomedX(x, zoom);
  const _y = zoomedY(y, zoom);
  const _width = zoomed(width, zoom);
  const _height = zoomed(height, zoom);
  ctx.strokeStyle = colorBorderHoverGroup;
  const lineW = lineWidth * (!isHover ? initScale : 1);
  const half = lineW / 2;
  ctx.lineWidth = lineW;
  ctx.strokeRect(_x - half, _y - half, _width + lineW, _height + lineW);
  ctx.closePath();
  ctx.restore();

  if (isSelection) {
    DrawSquareResize(ctx, screen);
  }
};
