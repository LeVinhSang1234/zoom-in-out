import { COLOR_TEXT, FONT_FAMILY } from "../conts";
import { ComponentApp } from "../types";
import { isHoved, zoomed, zoomedX, zoomedY } from "../utlis";

export const DrawText = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp,
  parents: ComponentApp[]
) => {
  const {
    fontSize = 14,
    fontFamily = FONT_FAMILY,
    fontWeight = "400",
    text = "",
    x,
    y,
    width,
    lineHeight = fontSize * 1.2,
    color = COLOR_TEXT,
    zoom,
    config,
    height,
    id,
  } = component;

  const { getControl } = config;
  const { setHover, removeHover, selection } = getControl();
  const { sx, sy } = parents.reduce(
    (a, b) => ({ sx: a.sx + b.x, sy: a.sy + b.y }),
    { sx: 0, sy: 0 }
  );

  let currentY = zoomedY(y + sy + lineHeight, zoom);

  const _x = zoomedX(x + sx, zoom);
  const _y = zoomedY(y + sy, zoom);
  const _w = zoomed(width, zoom);
  const _h = zoomed(height, zoom);

  const isHover = isHoved(zoom.mouse, { width: _w, height: _h, x: _x, y: _y });
  if (isHover) setHover(id);
  else removeHover(id);

  const maxWidth = zoomed(width, zoom);
  ctx.save();
  ctx.beginPath();
  if (selection?.[0] !== id) {
    ctx.rect(_x, _y, _w, _h);
    ctx.clip();
  }
  ctx.fillStyle = color;
  ctx.font = `${fontWeight} ${fontSize * zoom.scale}px ${fontFamily}`;
  const xDraw = zoomedX(x + sx, zoom);
  const lines = text.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let line = "";
    const currentLine = lines[lineIndex];
    for (let i = 0; i < currentLine.split(" ").length; i++) {
      const word = currentLine.split(" ")[i];
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, xDraw, currentY);
        line = word + " ";
        currentY += lineHeight * zoom.scale;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, xDraw, currentY);
    currentY += lineHeight * zoom.scale;
  }
  ctx.closePath();
  ctx.restore();
};
