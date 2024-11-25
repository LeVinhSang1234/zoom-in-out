import { CanvasContextValue } from "./context/canvas";

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const enum ComponentAppType {
  SCREEN = "Screen",
}

export type WindowSize = {
  width: number;
  height: number;
};

export type CSSPropertiesProps = {
  backgroundColor?: string;
};

export type Pointer = { x: number; y: number };

export type ComponentBase = {
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  id: string;
  children: ComponentBase[];
  text?: string;
  type: ComponentAppType;
} & CSSPropertiesProps;

export type TitleConfig = {
  width: number;
  height: number;
  x: number;
  y: number;
  fontSize: number;
  text: string;
  fullText: string;
  xCanvas: number;
  yCanvas: number;
  heightCanvas: number;
};

export type TitleReq = { id: string; config: TitleConfig };

export type ComponentProps = {} & WindowSize & Pointer;

export type ComponentApp = {
  zoom: Zoom;
  cursor: { inScreen: () => boolean; inTitle: () => boolean };
  children?: ComponentApp[];
  type: ComponentAppType;
  titleConfig: TitleConfig;
} & ComponentProps &
  ComponentBase & { config: CanvasContextValue };

export type Zoom = {
  scale: number;
  worldOrigin: Pointer; // translate x và translate y. sẽ bằng rx
  screenOrigin: Pointer; // Tương đương mouse x và y nhưng chỉ đc set lại.= mouse x , y khi giữ phím ctr vị trí => drag tới vị trí;
  mouse: Pointer & {
    rx: number; // vị trí chuột x sau khi bị scale và translate so với thực tế
    ry: number; // vị trí chuột y sau khi bị scale và translate so với thực tế
    bounds?: DOMRect;
    // x:  vị trí chuột x thực tế trên màn hình
    // y: vị trí chuột y thực tế trên màn hình
  };
};

export enum CursorType {
  DEFAULT = "default",
  GRAB = "grab",
  GRABBING = "grabbing",
}

export enum KEYBOARD_CODE {
  F12 = "F12",
  F7 = "F7",
  SPACE = "Space",
}

export enum MouseType {
  DOWN = "mousedown",
  UP = "mouseup",
  OUT = "mouseout",
  MOVE = "mousemove",
}

export type Point = [number, number];
