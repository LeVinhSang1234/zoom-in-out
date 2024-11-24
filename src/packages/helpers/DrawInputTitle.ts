import { RATIO } from "../conts";
import { ComponentApp, ComponentBase } from "../types";
import { componentAppToBase, textToWidth } from "../utlis";

export const DrawInputTitle = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp,
  onChange?: (com: ComponentBase) => void
) => {
  const { config, id, titleConfig, width } = component;
  const { getControl, ratio = RATIO, fontSize } = config;
  const { titleEdited, removeTitleEdited } = getControl();
  if (titleEdited?.id !== id) return;
  let input = titleEdited?.input;
  if (!input) {
    input = document.createElement("input");
    document.body.appendChild(input);
    input.className = "input-edited";
    input.style.width = `${titleConfig.width / ratio}px`;
    input.oninput = (e: any) => {
      component.title = e.target.value;
      const _width = textToWidth(ctx, component.title!, { fontSize, ratio });
      input!.style.width = `${_width / ratio}px`;
      onChange?.(componentAppToBase(component));
    };
    input.onkeydown = (e: any) => {
      if (e.key === "Enter") removeTitleEdited(titleEdited.id);
      onChange?.(componentAppToBase(component));
    };
  }
  input.style.position = "absolute";
  input.style.left = `${titleConfig.x / ratio}px`;
  input.style.top = `${titleConfig.y / ratio}px`;
  input.style.height = `${titleConfig.height / ratio}px`;
  input.style.maxWidth = `${(width - 4) / ratio}px`;
  input.setAttribute("value", `${titleConfig.fullText}`);
  input.style.fontSize = `${titleConfig.fontSize / ratio}px`;
  if (!titleEdited.input) {
    setTimeout(() => input?.select(), 0);
  }
  titleEdited.input = input;
};
