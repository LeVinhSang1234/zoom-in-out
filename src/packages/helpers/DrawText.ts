import { COLOR_TEXT, FONT_FAMILY } from "../conts";
import { ComponentApp } from "../types";
import { zoomed, zoomedX, zoomedY } from "../utlis";

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
  } = component;
  const { sx, sy } = parents.reduce(
    (a, b) => ({ sx: a.sx + b.x, sy: a.sy + b.y }),
    { sx: 0, sy: 0 }
  );
  let currentY = zoomedY(y + sy + lineHeight, zoom);
  const maxWidth = zoomed(width, zoom);
  ctx.save();
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

  ctx.restore();
};
