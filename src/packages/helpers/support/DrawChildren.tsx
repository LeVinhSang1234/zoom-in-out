import { ComponentApp, ComponentAppType } from "../../types";
import { DrawGroup } from "../DrawGroup";
import { DrawText } from "../DrawText";

type TDraw = {
  [key in ComponentAppType]: (
    ctx: CanvasRenderingContext2D,
    component: ComponentApp,
    parent: ComponentApp[],
  ) => void;
};

export const DrawWithType: TDraw = {
  [ComponentAppType.GROUP]: DrawGroup,
  [ComponentAppType.TEXT]: DrawText,
  [ComponentAppType.FRAME]: DrawGroup,
};

export const DrawChildrenComponent = (
  ctx: CanvasRenderingContext2D,
  screen: ComponentApp,
  parents: ComponentApp[]
) => {
  if (!screen.children?.length) return;
  for (const component of screen.children) {
    DrawWithType[component.type]?.(ctx, component, [...parents, screen]);
  }
};
