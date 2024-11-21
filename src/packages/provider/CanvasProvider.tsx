import { Component, ReactNode } from "react";
import {
  CanvasContext,
  CanvasContextValue,
  defaultValueContext,
} from "../context/canvas";

type Props = {
  children?: ReactNode;
} & { config: Partial<CanvasContextValue> };

class CanvasProvider extends Component<Props> {
  render() {
    const { children, config } = this.props;
    return (
      <CanvasContext.Provider value={{ ...defaultValueContext, ...config }}>
        {children}
      </CanvasContext.Provider>
    );
  }
}

export default CanvasProvider;
