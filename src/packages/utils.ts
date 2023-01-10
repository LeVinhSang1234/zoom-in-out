import { CSSProperties } from "react";

export const styleSx = (
  ...args: (CSSProperties[] | CSSProperties | null | undefined | boolean)[]
) => {
  let object: CSSProperties = {};
  args.forEach((arg) => {
    if (Array.isArray(arg)) {
      object = { ...object, ...styleSx(...arg) };
    } else if (arg && typeof arg === "object") {
      object = { ...object, ...arg };
    }
  });
  return object;
};

export const clsx = (
  ...args: (string[] | string | null | undefined | boolean)[]
) => {
  let className = "";
  args.forEach((arg) => {
    if (Array.isArray(arg)) {
      className += ` ${clsx(...arg)}`;
    } else if (arg && typeof arg === "string") {
      className += ` ${arg}`;
    }
  });
  return className.trim();
};

export const appendCss = () => {
  const head = document.querySelector("head");
  if (!head) return () => null;
  const styleExist = document.querySelector("style[id=scroll--wrapper]");
  if (styleExist) return () => head.removeChild(styleExist);
  const style = document.createElement("style");
  style.id = "scroll--wrapper";
  style.innerHTML = `
  .scroll--animation,
  .scroll--animation--translate {
    width: 100%;
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
  }
  .scroll--animation--content {
    height: max-content;
    width: 100%;
    flex: 1;
  }
  `;
  head.appendChild(style);
  return () => {
    head.removeChild(style);
  };
};
