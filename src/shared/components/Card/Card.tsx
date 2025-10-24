import React from "react";
import "./Card.scss";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "outlined" | "shadow";
  className?: string;
  onClick?: () => void; // 👈 nueva propiedad para hacerla clicable
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  variant = "default",
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`card card--${variant} ${className} ${onClick ? "card--clickable" : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }} // 👈 cambia el cursor
    >
      {title && <div className="card__header">{title}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
