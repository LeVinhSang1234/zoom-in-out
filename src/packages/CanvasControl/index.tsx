import { Component, ReactNode, MouseEvent as MouseEventReact } from "react";
import { ComponentBase, ComponentProps, TypeHover, TypeResize } from "../types";
import {
  CanvasControlProvider,
  TCanvasControl,
  defaultCanvasControl,
} from "../context/CanvasControl";
import FPS from "../lib/FPS";
import {
  canvasRef,
  getGuideLinePage,
  isDoubleClick,
  rePositionMode,
  zoomRef,
} from "../Canvas/utlis";
import { INIT_SCALE } from "../conts";

type Props = {
  children?: ReactNode;
  components: ComponentBase[];
  update?: (component: ComponentProps, components: ComponentProps[]) => void;
};

class CanvasControl extends Component<Props> {
  control: TCanvasControl;
  captureScreen?: { x: number; y: number; width: number; height: number };

  constructor(props: Props) {
    super(props);
    this.control = {
      ...defaultCanvasControl,
      setHover: this.setHover,
      setHoverTitle: this.setHoverTitle,
      removeHover: this.removeHover,
      removeHoverTitle: this.removeHoverTitle,
      setSelections: this.setSelections,
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onMouseMove,
      onMouseUp: this.onMouseUp,
      setModeResize: this.setModeResize,
      removeModeResize: this.removeModeResize,
      onMouseMoveAuto: this.onMouseMoveAuto,
    };
    this.captureScreen = undefined;
  }

  private setHover = (id: string, paths: { id: string; paths: string[] }[]) => {
    this.control.hover = { [id]: paths };
  };

  private setHoverTitle = (
    id: string,
    paths: { id: string; paths: string[] }[]
  ) => {
    this.control.hoverTitle = { [id]: paths };
  };

  private removeHover = (id: string) => {
    const { hover } = this.control;
    if (hover?.[id]) this.control.hover = undefined;
  };

  private removeHoverTitle = (id: string) => {
    const { hoverTitle } = this.control;
    if (hoverTitle?.[id]) this.control.hoverTitle = undefined;
  };

  private setSelections = (
    selection: TypeHover | ((selections: TypeHover) => TypeHover)
  ) => {
    const { selections } = this.control;
    if (typeof selection === "function") {
      this.control.selections = selection(selections);
    } else this.control.selections = selection;
  };

  private onMouseDown = (event: MouseEventReact | MouseEvent) => {
    const { hoverTitle, modeResize, selections = {} } = this.control;
    const array = Object.keys(selections || {});
    const selection = array[array.length - 1];
    const point = { x: event.pageX, y: event.pageY };
    if (array.length === 1 && modeResize?.[selection]) {
      this.control.mouseResize = { pre: point, lastUsed: point };
      return;
    }
    if (hoverTitle) {
      const isDouble = isDoubleClick("mouseDownCanvas");
      console.log("asdsa", isDouble);
      this.control.mouseDrag = { pre: point, lastUsed: point };
    }
    this.setSelections(hoverTitle || {});
  };

  private onMouseMove = (event: MouseEventReact | MouseEvent) => {
    event.preventDefault?.();
    const { mouseResize, mouseDrag } = this.control;
    const { pressSpace } = canvasRef.get();
    if ((!mouseResize && !mouseDrag) || pressSpace) return;
    this.control.isMouseMove = true;
    const zoom = zoomRef.get();
    let scale = 1;
    if (zoom) scale = zoom.scale / INIT_SCALE;
    let pre = mouseDrag?.pre;
    const point = { x: event.pageX, y: event.pageY };
    if (!pre) {
      pre = mouseResize?.pre;
      this.control.mouseResize = { pre: point, lastUsed: point };
    } else this.control.mouseDrag = { pre: point, lastUsed: point };
    if (!pre) return;
    const xChange = pre.x - point.x;
    const yChange = pre.y - point.y;
    this.updateResizeScreen(xChange / scale, yChange / scale);
  };

  private onMouseMoveAuto = ({
    pageX,
    pageY,
  }: {
    pageX: number;
    pageY: number;
  }) => {
    const zoom = zoomRef.get();
    const { components } = this.props;
    if (zoom) {
      const { screen } = this.getScreenEdit();
      if (!screen || !this.captureScreen) return;
      this.captureScreen.x -= pageX;
      this.captureScreen.y -= pageY;
      screen.x = this.captureScreen.x;
      screen.y = this.captureScreen.y;
      const { windowSize } = canvasRef.get();
      const guide = getGuideLinePage(components, screen, windowSize);
      this.control.guideLine = guide.line;
    }
  };

  private onMouseUp = (_event: MouseEventReact | MouseEvent) => {
    delete this.control.mouseResize;
    delete this.control.mouseDrag;
    this.control.isMouseMove = false;

    /* ------- CALL FUNCTION UPDATE WHEN END EDIT ------ */
    if (this.captureScreen) {
      delete this.captureScreen;
      const { screen } = this.getScreenEdit();
      if (!screen) return;
      const { update, components } = this.props;
      update?.(screen, components);
    }
    /* ------- CALL FUNCTION UPDATE WHEN END EDIT ------ */
  };

  private setModeResize = (mode: TypeResize) => {
    this.control.modeResize = mode;
  };

  private removeModeResize = (id: string) => {
    delete this.control.modeResize?.[id];
    const { modeResize } = this.control;
    if (modeResize && !Object.keys(modeResize).length) {
      delete this.control.modeResize;
    }
  };

  /* ------- GET SCREEN FOCUS ALLOW EDIT ------ */
  private getScreenEdit = () => {
    const { selections } = this.control;
    const selectionsArray = Object.keys(selections || {});
    if (selectionsArray.length > 1 || !selectionsArray.length) return {};

    const { components } = this.props;
    const selection = selectionsArray[selectionsArray.length - 1];
    let screen: ComponentBase | undefined;
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      if (component.id === selection) {
        screen = component;
        break;
      }
      const paths = selections[selection];
      if (paths?.length) {
        const parentId = paths[paths.length - 1]?.id;
        if (component.id === parentId) {
          screen = component;
          break;
        }
      }
    }
    return { screen, selection };
  };
  /* ------- GET SCREEN FOCUS ALLOW EDIT ------ */

  private updateResizeScreen = (xChange: number, yChange: number) => {
    const { modeResize } = this.control;
    const { components } = this.props;

    const { screen, selection } = this.getScreenEdit();
    if (!screen) return;
    const { windowSize } = canvasRef.get();

    const screenGetSize = this.captureScreen || screen; // get x, y, width, height actual when auto calculate x y width height
    const { x, y, width, height } = screenGetSize;
    const frame = { x, y, width, height };

    const mode = modeResize?.[selection]?.mode;
    const size = rePositionMode(frame, { x: xChange, y: yChange }, mode);

    /* ------- CAPTURE SCREEN CHANGE ------ */
    this.captureScreen = size;
    /* ------- CAPTURE SCREEN CHANGE ------ */

    /* ------- MAP X Y WIDTH HEIGHT SCREEN WHEN MOVE, RESIZE ------ */
    screen.x = size.x;
    screen.y = size.y;
    screen.width = size.width;
    screen.height = size.height;
    /* ------- MAP X Y WIDTH HEIGHT SCREEN WHEN MOVE, RESIZE ------ */

    /* ------- GET GUIDLINE AND AUTO UPDATE X Y WIDTH HEIGHT ------ */
    const guide = getGuideLinePage(components, screen, windowSize, mode);
    this.control.guideLine = guide.line;
    /* ------- GET GUIDLINE AND AUTO UPDATE X Y WIDTH HEIGHT ------ */
  };

  render() {
    const { children, components } = this.props;
    return (
      <CanvasControlProvider
        value={{ getControl: () => this.control, components }}
      >
        {children}
        <FPS />
      </CanvasControlProvider>
    );
  }
}

export default CanvasControl;
