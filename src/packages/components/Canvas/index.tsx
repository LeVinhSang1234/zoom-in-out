import { Component } from "react";
import FPS from "../../lib/FPS";
import EventListener from "../../lib/EventListener";
import ElementListener from "../../lib/ElementListener";
import DisabledBrowser from "../../lib/DisabledBrowser";
import { withCanvasProvider } from "../../context/withCanvasProvider";
import { withControlProvider } from "../../context/withControlProvider";
import { DrawInputTitle } from "../../helpers/DrawInputTitle";
import { DrawBoxResize } from "../../helpers/DrawBoxResize";
import { DrawFramePixel } from "../../helpers/DrawFramePixel";
import { BACKGROUND_COLOR, MAX_ZOOM, MIN_ZOOM, RATIO } from "../../conts";
import { DrawName } from "../../helpers/DrawName";
import {
  AppControl,
  CanvasContextValue,
  ComponentApp,
  ComponentBase,
  KEYBOARD_CODE,
  ModeResize,
  TCanvasControlContext,
  WindowSize,
  Zoom,
} from "../../types";
import { DrawPage } from "../../helpers/DrawPage";
import {
  changeClass,
  getConfig,
  getMaxHeightSize,
  getMaxWidthSize,
  getSize,
  configCursor,
  makeTitle,
  zoomedX_INV,
  zoomedY_INV,
} from "../../utlis";

import "./index.css";
import { AppendResize } from "../../helpers/AppendResize";

type Props = {
  layout: WindowSize;
  components: ComponentBase[];
};

class CanvasBase extends Component<Props> {}

type CanvasProps = Props & CanvasContextValue & TCanvasControlContext;

class Canvas extends Component<CanvasProps> {
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private zoom: Zoom;
  private app: AppControl;

  constructor(props: CanvasProps & CanvasContextValue) {
    super(props);
    this.ctx = null;
    this.canvas = null;
    const { layout, initScale = 1, components, ratio = RATIO } = props;
    const { width, height } = getSize(layout, ratio);
    const maxWidth = getMaxWidthSize(components, initScale);
    const maxHeight = getMaxHeightSize(components, initScale);
    const origin = { x: (width - maxWidth) / 2, y: (height - maxHeight) / 2 };
    this.zoom = {
      scale: initScale,
      worldOrigin: { x: 0, y: 0 },
      screenOrigin: { ...origin },
      mouse: { ...origin, rx: 0, ry: 0, bounds: undefined },
    };
    this.zoom.mouse.rx = zoomedX_INV(origin.x, this.zoom);
    this.zoom.mouse.ry = zoomedY_INV(origin.y, this.zoom);
    this.app = { isPressSpace: false };
  }

  shouldComponentUpdate(nProps: CanvasProps): boolean {
    const { layout, ratio = RATIO } = this.props;
    if (layout !== nProps.layout) {
      this.setSizeCanvas(nProps.layout, ratio);
      this.draw();
    }
    return false;
  }

  componentDidMount(): void {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    const { layout, ratio = RATIO } = this.props;
    this.setSizeCanvas(layout, ratio);
    this.draw();
  }

  private calculateMouse = (event: MouseEvent) => {
    if (!this.canvas) return;
    const { mouse } = this.zoom;
    const { ratio = RATIO } = this.props;
    const size = getSize(
      { width: event.clientX, height: event.clientY },
      ratio
    );
    mouse.bounds = this.canvas.getBoundingClientRect();
    mouse.x = size.width - mouse.bounds.left;
    mouse.y = size.height - mouse.bounds.top;
    const xx = mouse.rx;
    const yy = mouse.ry;
    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    if (this.app.isPressSpace && this.app.cursorDowning) {
      this.zoom.worldOrigin.x -= mouse.rx - xx;
      this.zoom.worldOrigin.y -= mouse.ry - yy;
      mouse.rx = zoomedX_INV(mouse.x, this.zoom);
      mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    }
    const { x, y, screenX, screenY, pageX, pageY } = event;
    this.app.cursor = { x, y, screenX, screenY, pageX, pageY };
  };

  private onMouseEvent = (event: MouseEvent) => {
    if (!this.canvas) return;
    this.calculateMouse(event);
    this.draw();
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!this.canvas) return;
    this.calculateMouse(event);
    this.draw();
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const {
      minZoom = MIN_ZOOM,
      maxZoom = MAX_ZOOM,
      ratio = RATIO,
    } = this.props;
    const { mouse } = this.zoom;
    if (e.ctrlKey || e.metaKey) {
      this.calculateMouse(e);
      let scale = Math.min(maxZoom, this.zoom.scale * 1.1);
      if (e.deltaY >= 0) {
        scale = Math.max(minZoom, this.zoom.scale * (1 / 1.1));
      }
      this.zoom.scale = scale;
      this.zoom.worldOrigin.x = mouse.rx;
      this.zoom.worldOrigin.y = mouse.ry;
      this.zoom.screenOrigin.x = mouse.x;
      this.zoom.screenOrigin.y = mouse.y;
    } else {
      const size = getSize({ width: e.deltaX, height: e.deltaY }, ratio);
      this.zoom.worldOrigin.y += size.height / 5 / this.zoom.scale;
      this.zoom.worldOrigin.x += size.width / 5 / this.zoom.scale;
    }
    mouse.rx = zoomedX_INV(mouse.x, this.zoom);
    mouse.ry = zoomedY_INV(mouse.y, this.zoom);
    this.draw();
  };

  draw = (props = this.props) => {
    if (!this.ctx || !this.canvas) return;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.imageSmoothingEnabled = true;

    this.ctx.save();
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.rect(0, 0, width, height);
    this.ctx.fill();
    this.ctx.restore();

    const { layout } = props;
    const components = props.components as ComponentApp[];
    const config = getConfig({ ...props, isPressSpace: this.app.isPressSpace });
    for (const component of components) {
      component.zoom = this.zoom;
      component.config = config;

      // ---- Cursor -----//
      configCursor(component);
      component.cursor.getApp = () => this.app;
      component.cursor.triggerModeResize = (mode?: ModeResize) => {
        this.triggerModeResize(component, mode);
      };
      // ---- Cursor -----//

      AppendResize(component);

      // ------- Title --------- //
      makeTitle(this.ctx!, component);
      component.titleConfig.onChange = (title: string) => {
        component.title = title;
        this.draw();
      };
      // ------- Title --------- //

      DrawPage(this.ctx!, component);
    }
    DrawFramePixel(this.ctx, { layout, zoom: this.zoom, config });
    for (const component of components) {
      DrawName(this.ctx!, component);
      DrawInputTitle(this.ctx!, component);
      DrawBoxResize(this.ctx!, component);
    }
  };

  private triggerModeResize = (component: ComponentApp, mode?: ModeResize) => {
    this.app.modeResize = mode;
    if (mode) {
      const { x, y, width, height } = component;
      this.app.sizeBegin = { x, y, width, height };
    } else this.app.sizeBegin = undefined;
    this.canvasMode(mode);
  };

  private setSizeCanvas = (windowSize: WindowSize, radio: number) => {
    if (!this.canvas) return;
    const size = getSize(windowSize, radio);
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    this.canvas.style.width = `${windowSize.width}px`;
    this.canvas.style.height = `${windowSize.height}px`;
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE && !this.app.isPressSpace) {
      this.app.isPressSpace = true;
      if (!this.app.cursorDowning) this.canvasGrab();
      else this.canvasGrabbing();
      this.draw();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.code === KEYBOARD_CODE.SPACE) {
      this.app.isPressSpace = false;
      this.canvasCursor();
      this.draw();
    }
  };

  private onMouseDown = (event: MouseEvent) => {
    const { x, y, screenX, screenY, pageX, pageY } = event;
    this.app.cursorDowning = { x, y, screenX, screenY, pageX, pageY };
    const { isPressSpace, modeResize } = this.app;
    if (isPressSpace) return this.canvasGrabbing();

    const { getControl } = this.props;
    const control = getControl();
    const { titleEdited, titleHover, setSelection } = control;
    if (titleEdited) control.removeTitleEdited(titleEdited.id);

    if (modeResize) return;

    if (titleHover?.id) {
      setSelection([titleHover.id]);
      this.app.modeResize = ModeResize.DRAG_DROP;
    } else setSelection([]);

    this.draw();
  };

  private onDoubleClick = (event: MouseEvent) => {
    const { titleHover, setTitleEdited, selection } = this.props.getControl();
    if (titleHover && selection.includes(titleHover?.id)) {
      setTitleEdited(titleHover.id);
      this.draw();
    } else this.onMouseDown(event);
  };

  private onMouseUp = () => {
    this.app.cursorDowning = undefined;
    this.app.sizeBegin = undefined;
    if (this.app.isPressSpace) this.canvasGrab();
    else if (!this.app.modeResize) this.canvasCursor();
  };

  private canvasGrab = () => {
    changeClass(this.canvas, "canvas --no-edit canvas--grab");
  };

  private canvasGrabbing = () => {
    changeClass(this.canvas, "canvas --no-edit canvas--grabbing");
  };

  private canvasMode = (mode?: ModeResize) => {
    if (!mode || mode === ModeResize.DRAG_DROP)
      return changeClass(this.canvas, "canvas --no-edit");
    if ([ModeResize.TOP_RIGHT, ModeResize.BOTTOM_LEFT].includes(mode)) {
      changeClass(this.canvas, "canvas --no-edit canvas--resize-tr_bl");
    } else if ([ModeResize.TOP_LEFT, ModeResize.BOTTOM_RIGHT].includes(mode)) {
      changeClass(this.canvas, "canvas --no-edit canvas--resize-tl_br");
    } else if ([ModeResize.LEFT, ModeResize.RIGHT].includes(mode)) {
      changeClass(this.canvas, "canvas --no-edit canvas--resize-horizontal");
    } else if ([ModeResize.TOP, ModeResize.BOTTOM].includes(mode)) {
      changeClass(this.canvas, "canvas --no-edit canvas--resize-vertical");
    }
  };

  private canvasCursor = () => {
    if (this.canvas) this.canvas.className = "canvas --no-edit";
  };

  render() {
    const { layout: size, backgroundColor = BACKGROUND_COLOR } = this.props;
    const style = { backgroundColor, ...size };
    return (
      <>
        <canvas
          {...size}
          ref={(ref) => (this.canvas = ref)}
          style={style}
          className="canvas --no-edit"
        />
        <ElementListener
          options={{ passive: false }}
          getDom={() => this.canvas}
          onWheel={this.onWheel}
          onMouseDown={this.onMouseDown}
          onDoubleClick={this.onDoubleClick}
          onMouseOut={this.onMouseEvent}
        />
        <EventListener
          options={{ passive: false }}
          onMouseUp={this.onMouseUp}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onMouseMove={this.onMouseMove}
        />
        <DisabledBrowser />
        <FPS />
      </>
    );
  }
}

export default withCanvasProvider(
  withControlProvider(Canvas)
) as unknown as typeof CanvasBase;
