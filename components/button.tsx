import styled from "styled-components";
import { FunctionComponent, MouseEventHandler } from "react";

const StyledButton = styled.button`
  width: 100%;
  margin-top: 0;
  border: none;
  padding: 0.6em;
  border-radius: 0 0 3px 3px;
  background-color: var(--bg-colour-secondary);
  color: var(--text-colour-secondary);
  font-size: ${(props: ButtonStyleProps) =>
    props.fontSize ? props.fontSize : "1.9em"};
  transition: all 0.15s ease-in-out;
  transition: transform 0.07s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    background-color: #00515d;
  }

  &:active {
    transform: translateY(2px);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.7;
  }
`;

interface ButtonProps {
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset" | undefined;
  fontSize?: string | undefined;
}

interface ButtonStyleProps {
  fontSize: string | undefined;
}

const Button: FunctionComponent<ButtonProps> = ({
  disabled,
  onClick,
  type,
  fontSize,
  children,
}) => {
  return (
    <StyledButton
      fontSize={fontSize}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
