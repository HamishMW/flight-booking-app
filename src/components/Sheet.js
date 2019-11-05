import React from 'react';
import styled from 'styled-components/macro';

export default function Sheet({ title, description, children, ...props }) {
  return (
    <SheetContainer {...props}>
      <SheetContent>
        {children}
      </SheetContent>
    </SheetContainer>
  );
}

const SheetContainer = styled.div`
  box-shadow: ${props => props.theme.shadowCard};
  border-radius: ${props => props.theme.borderRadius * 2}px;
  background-color: ${props => props.theme.colorSurface};
  flex: ${props => props.shrinkable ? '1 1 auto' : '1 0 100%'};
  position: relative;
`;

const SheetContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const SheetHeader = styled.div`
  padding: 6px 0;
`;

export const SheetTitle = styled.h1`
  color: ${props => props.theme.colorTextTitle};
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
  text-align: center;
  margin: 0;
`;

export const SheetDescription = styled.p`
  font-size: 16px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 10px;
  line-height: 1.2;
`;

export const SheetForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;
  padding: ${props => props.theme.sheetPadding}px;
`;

export const SheetFormInputs = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: ${props => props.gap !== undefined ? props.gap : 20}px;
  align-content: flex-start;
  margin-top: ${props => props.margin !== undefined ? props.margin : 0}px;
  margin-bottom: ${props => props.margin !== undefined ? props.margin : 0}px;
`;

export const SheetFormActions = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  display: grid;
  grid-gap: 20px;
`;
