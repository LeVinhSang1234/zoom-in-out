import { ComponentApp } from "../types";

export const DrawName = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp
) => {
  const { config, cursor, id, titleConfig } = component;
  const { titlePageColor, titlePageHoverColor, getControl } = config;
  let text = titleConfig.text;
  const { setTitleHover, removeTitleHover, titleEdited, selection } =
    getControl();

  ctx.save();
  ctx.beginPath();
  ctx.font = `400 ${titleConfig.fontSize}px Inter, sans-serif`;
  const isSelection = selection[0] === id;

  const isHoverScreen = cursor.inScreen();
  const isHoverTitle = cursor.inTitle();
  const modeResize = cursor.getApp().modeResize
  const isHover = ((isHoverScreen || isHoverTitle) && !modeResize) || isSelection;

  if (isHoverTitle) {
    setTitleHover({ id, config: titleConfig });
  } else removeTitleHover(id);

  ctx.fillStyle = !isHover ? titlePageColor : titlePageHoverColor;
  ctx.textAlign = "left";
  ctx.fillText(
    titleEdited?.id !== id ? text : "",
    titleConfig.xCanvas,
    titleConfig.yCanvas
  );
  ctx.closePath();
  ctx.restore();
};
