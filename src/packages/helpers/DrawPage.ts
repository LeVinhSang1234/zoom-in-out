import { ComponentApp } from "../types";
import { zoomed, zoomedX, zoomedY } from "../utlis";
import { DrawChildrenComponent } from "./support/DrawChildren";

export const DrawPage = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp
) => {
  const { x, y, width, height, cursor, backgroundColor, config, id } = screen;
  const _x = zoomedX(x, screen.zoom);
  const _y = zoomedY(y, screen.zoom);
  const _width = zoomed(width, screen.zoom);
  const _height = zoomed(height, screen.zoom);
  const { getControl } = config;
  const { setHover, removeHover } = getControl();
  const isHoverScreen = cursor.inScreen();
  const isHoverTitle = cursor.inTitle();
  const isHover = isHoverScreen || isHoverTitle;

  if (isHover) {
    setHover(id);
  } else removeHover(id);

  ctx.save();
  ctx.fillStyle = backgroundColor || "#ffffff";
  ctx.fillRect(_x, _y, _width, _height);

  ctx.beginPath();
  ctx.rect(_x, _y, _width, _height);
  ctx.clip();
  DrawChildrenComponent(ctx, screen, []);
  ctx.closePath();
  ctx.restore();
};
