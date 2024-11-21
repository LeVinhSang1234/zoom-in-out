import { ComponentApp } from "../types";

export const DrawInputEdit = (component: ComponentApp) => {
  const { config } = component;
  console.log("sadas", config.getControl());
};
