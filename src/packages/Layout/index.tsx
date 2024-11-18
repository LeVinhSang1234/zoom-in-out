import { Component, ReactNode } from "react";
  
type Props = {
  children?: ReactNode;
};

class Layout extends Component<Props> {
  render() {
    const { children } = this.props;
    return <div className="layout-canvas">{children}</div>;
  }
}

export default Layout;
