import { ComponentApp } from "../types";
import { zoomed, zoomedX, zoomedY } from "../utlis";
import { DrawChildrenComponent } from "./support/DrawChildren";

export const DrawFrame = (
  ctx: CanvasRenderingContext2D,
  frame: ComponentApp
) => {
  const { x, y, width, height, cursor, backgroundColor, config, id } = frame;
  const _x = zoomedX(x, frame.zoom);
  const _y = zoomedY(y, frame.zoom);
  const _width = zoomed(width, frame.zoom);
  const _height = zoomed(height, frame.zoom);
  const { getControl } = config;
  const { setHover, removeHover } = getControl();
  const isHover = cursor.inTitle();

  if (isHover) {
    setHover(id);
  } else removeHover(id);

  ctx.save();
  ctx.fillStyle = backgroundColor || "#ffffff";
  ctx.fillRect(_x, _y, _width, _height);

  ctx.beginPath();
  ctx.rect(_x, _y, _width, _height);
  ctx.clip();
  DrawChildrenComponent(ctx, frame, []);
  ctx.closePath();
  ctx.restore();
};
