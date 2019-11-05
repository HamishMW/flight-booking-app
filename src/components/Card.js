import styled from 'styled-components/macro';

const Card = styled.div`
  box-shadow: ${props => props.theme.shadowCard};
  border-radius: ${props => props.theme.borderRadius}px;
  background-color: ${props => props.theme.colorSurface};
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

export default Card;
