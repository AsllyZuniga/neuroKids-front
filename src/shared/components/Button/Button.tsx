import React from "react";
import "./Button.scss";

type ButtonVariant = "primary" | "secondary" | "text" | "nivel1" | "nivel2" | "nivel3";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  variant = "nivel1",
  size = "medium",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button button--${variant} button--${size} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
