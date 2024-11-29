import { ComponentApp } from "../types";

export const DrawInputTitle = (
  ctx: CanvasRenderingContext2D,
  component: ComponentApp
) => {
  const { config, id, titleConfig, width } = component;
  const { getControl, ratio, onChange } = config;
  const { titleEdited, removeTitleEdited } = getControl();
  if (titleEdited?.id !== id) return;
  let input = titleEdited?.input;
  if (!input) {
    input = document.createElement("input");
    document.body.appendChild(input);
    input.className = "input-edited __no-edit";
    input.oninput = (e: any) => {
      component.title = e.target.value;
      onChange(e.target.value);
    };
    input.onkeydown = (e: any) => {
      if (e.key === "Enter") {
        removeTitleEdited(titleEdited.id);
        component.title = e.target.value.trim() || "Frame";
        onChange(e.target.value);
      }
    };
    input.onblur = (e: any) => {
      component.title = e.target.value.trim() || "Frame";
      onChange(e.target.value);
    };
  }
  input.style.left = `${titleConfig.x / ratio}px`;
  input.style.top = `${titleConfig.y / ratio}px`;
  input.style.width = `${titleConfig.width / ratio}px`;
  input.style.height = `${titleConfig.height / ratio}px`;
  input.style.maxWidth = `${(width - 4) / ratio}px`;
  input.setAttribute("value", `${titleConfig.fullText}`);
  input.style.fontSize = `${titleConfig.fontSize / ratio}px`;
  if (!titleEdited.input) {
    setTimeout(() => input?.select(), 0);
  }
  titleEdited.input = input;
};
