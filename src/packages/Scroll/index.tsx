import { Component, CSSProperties, ReactNode } from "react";
import { appendCss, clsx, styleSx } from "../utils";

type ScrollProps = {
  style?: CSSProperties[] | CSSProperties;
  className?: string[] | string;
  children?: ReactNode;
};

class Scroll extends Component<ScrollProps> {
  listener?: () => void;

  componentDidMount(): void {
    const listener = appendCss();
    window.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("touchmove", this.toucheMove, { passive: false });
    this.listener = () => {
      listener();
      window.removeEventListener("wheel", this.onWheel);
      window.removeEventListener("touchmove", this.toucheMove);
    };
  }

  onWheel = (ev: WheelEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log("asdas", ev);
  };

  toucheMove = (ev: TouchEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  componentWillUnmount(): void {
    this.listener?.();
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default Scroll;
