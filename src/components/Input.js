import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components/macro';
import { useId } from 'hooks';
import { ReactComponent as IconExpandMore } from 'assets/icon-expand-more.svg';
import { ReactComponent as IconError } from 'assets/icon-error.svg';

const Input = forwardRef(({
  label,
  labelHidden,
  className,
  style,
  children,
  error,
  as,
  type,
  hideLabel,
  ...props
}, ref) => {
  const id = useId();
  const inputId = `input-${id}`;
  const labelId = `input-${id}-label`;
  const errorId = `input-${id}-error`;
  const inputName = `input-${id}-name`;
  const isSelect = as === 'select';

  return (
    <InputContainer className={className} style={style}>
      <InputLabel labelHidden={labelHidden} id={labelId} htmlFor={inputId}>{label}</InputLabel>
      <InputElement
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        ref={ref}
        id={inputId}
        as={as}
        type={isSelect ? null : type} {...props}
        name={inputName}
      >
        {children}
      </InputElement>
      {isSelect && <InputSelectIcon />}
      {error &&
        <InputError data-input-error="" id={errorId} role="alert">
          <IconError />
          {error}
        </InputError>
      }
    </InputContainer>
  );
});

Input.defaultProps = {
  type: 'text',
};

export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 6px;
  position: relative;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colorTextTitle};

  ${props => props.labelHidden && css`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    position: absolute;
  `}
`;

export const InputElement = styled.input`
  height: 48px;
  font-size: 16px;
  appearance: none;
  border-radius: ${props => props.theme.borderRadius}px;
  border: 0;
  padding: 0 14px;
  box-shadow: inset 0 0 0 1px ${props => props.theme.colorBorder};
  transition: box-shadow 0.3s ease;
  color: ${props => props.theme.colorText};
  background-color: ${props => props.theme.colorInputBackground};

  &:focus {
    box-shadow: inset 0 0 0 2px ${props => props.theme.colorPrimary};
    outline: none;
  }
`;

export const InputError = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colorErrorDark};
`;

const InputSelectIcon = styled(IconExpandMore)`
  margin: auto 12px auto auto;
  pointer-events: none;
  position: absolute;
  right: 0;
  bottom: 12px;
`;
export default Input;
