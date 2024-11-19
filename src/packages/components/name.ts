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
    fontSize: fontSize * initScale,
  };
};

export const name = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp
) => {
  const { x, y, config, cursor, id, titleConfig } = component;
  const {
    fontSize,
    initScale,
    titlePageColor,
    titlePageHoverColor,
    getControl,
  } = config;
  let text = titleConfig.text;
  const { setTitleHover, removeTitleHover } = getControl();

  ctx.save();
  ctx.beginPath();
  ctx.font = `400 ${fontSize * initScale}px Inter, sans-serif`;
  const isHoverScreen = cursor.inScreen();
  const isHoverTitle = cursor.inTitle();
  const isHover = isHoverScreen || isHoverTitle;

  if (isHoverTitle) {
    setTitleHover({ id, config: titleConfig });
  } else removeTitleHover(id);

  ctx.fillStyle = !isHover ? titlePageColor : titlePageHoverColor;
  ctx.textAlign = "left";
  ctx.fillText(text, x, y - SUB * initScale);
  ctx.closePath();
  ctx.restore();
};
