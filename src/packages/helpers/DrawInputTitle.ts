import { RATIO } from "../conts";
import { ComponentApp } from "../types";

export const DrawInputTitle = (component: ComponentApp) => {
  const { config, id, titleConfig } = component;
  const { getControl, ratio = RATIO } = config;
  const { titleEdited } = getControl();
  if (titleEdited?.id !== id) return;
  let input = titleEdited?.input;
  if (!input) {
    input = document.createElement("input");
    document.body.appendChild(input);
    input.className = "input-edited";
    input.addEventListener("input", function () {
      console.log("asdas", this.value);
    });
  }
  input.style.position = "absolute";
  input.style.left = `${titleConfig.x / ratio}px`;
  input.style.top = `${titleConfig.y / ratio}px`;
  input.style.height = `${titleConfig.height / ratio}px`;
  input.style.width = `${titleConfig.width / ratio}px`;
  input.setAttribute("value", `${titleConfig.fullText}`);
  input.style.fontSize = `${titleConfig.fontSize / ratio}px`;
  if (!titleEdited.input) {
    setTimeout(() => input?.select(), 0);
  }
  titleEdited.input = input;
};
