import React from "react";
import "./Card.scss";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "outlined" | "shadow";
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  variant = "default",
  className = "",
}) => {
  return (
    <div className={`card card--${variant} ${className}`}>
      {title && <div className="card__header">{title}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
