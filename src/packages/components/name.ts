import { ComponentApp } from "../types";

const SUB = 7;

export const makeTitle = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp
) => {
  const { width, x, y, name, title, config } = component;
  const { fontSize, initScale } = config;
  let text = title || name;
  ctx.save();
  ctx.beginPath();
  ctx.font = `400 ${fontSize * initScale}px Inter, sans-serif`;
  let textWidth = ctx.measureText(text).width;
  const rectWidth = width - 10;
  if (textWidth > rectWidth) {
    const ellipsis = "...";
    let truncatedText = text.slice(0, -1);
    while (
      truncatedText.length > 1 &&
      ctx.measureText(truncatedText + ellipsis).width > rectWidth
    ) {
      truncatedText = truncatedText.slice(0, -1);
    }
    text = truncatedText + ellipsis;
  }
  const height = fontSize * initScale;
  const yText = y - SUB * initScale;
  ctx.closePath();
  ctx.restore();
  component.titleConfig = {
    width: textWidth,
    height: height + SUB * initScale,
    x,
    y: yText - height,
    text,
  };
};

export const name = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp
) => {
  const { x, y, name, title, config, cursor } = component;
  const { fontSize, initScale, titlePageColor, titlePageHoverColor } = config;
  let text = title || name;
  if (!text) return;
  ctx.save();
  ctx.beginPath();
  ctx.font = `400 ${fontSize * initScale}px Inter, sans-serif`;
  const isHover = cursor.inScreen();
  ctx.fillStyle = !isHover ? titlePageColor : titlePageHoverColor;
  ctx.textAlign = "left";
  ctx.fillText(text, x, y - SUB * initScale);
  ctx.closePath();
  ctx.restore();
};
