import styled from 'styled-components';
import * as token from "@/styles/values/token";

export const CardContainer = styled.div`
  position: absolute;
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  z-index: 100;
  border: 1px solid #DFDFDF;
`;

export const DetailRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.div`
  ${token.typography('caption', 'lg', 'semibold')}
  color: ${token.colors.text.dark};
  min-width: 100px;
  flex-shrink: 0;
`;

export const DetailValue = styled.div`
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.fill.charcoal};
  line-height: 1.5;
  flex: 1;
  white-space: pre-wrap;
`;