import { forwardRef } from "react";
import BootstrapButton, { type ButtonProps } from "react-bootstrap/Button";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, ref) => (
    <BootstrapButton
      ref={ref}
      className={`app-button ${className}`.trim()}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
