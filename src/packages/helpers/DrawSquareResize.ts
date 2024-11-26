import { SIZE_BOX_RESIZE } from "../conts";
import { ComponentApp } from "../types";
import { zoomed, zoomedX, zoomedY } from "../utlis";

export const DrawSquareResize = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp
) => {
  const { x, y, zoom, width, height, config } = screen;
  const {
    sizeBoxResize = SIZE_BOX_RESIZE,
    colorBorderHoverGroup,
    lineWidth,
    initScale,
  } = config;
  const _x = zoomedX(x, zoom);
  const _y = zoomedY(y, zoom);
  const _width = zoomed(width, zoom);
  const _height = zoomed(height, zoom);

  const _w = sizeBoxResize;
  const _h = sizeBoxResize;

  const hafl = sizeBoxResize / 2;

  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.strokeStyle = colorBorderHoverGroup;
  ctx.lineWidth = lineWidth * initScale;
  ctx.rect(_x - hafl, _y - hafl, _w, _h); // TOP LEFT
  ctx.rect(_x - hafl + _width, _y - hafl, _w, _h); // TOP RIGHT
  ctx.rect(_x - hafl + _width, _y - hafl + _height, _w, _h); // BOTTOM RIGHT
  ctx.rect(_x - hafl, _y - hafl + _height, _w, _h); // BOTTOM LEFT
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};
