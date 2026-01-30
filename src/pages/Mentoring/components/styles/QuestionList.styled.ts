import styled from "styled-components";

interface Props {
  $isClicked: boolean;
}

export const container = styled.div<Props>`
  width: 26.69rem;
  height: 4.125rem;
  background-color: ${({ $isClicked }) => 
  $isClicked ? '#FEF9E0': '#ffffff'};
  border: solid 1px #FFD600;
  border-radius: 12px;
  padding: 0.9375rem 1.25rem;
`

export const questionItem = styled.div`
  
`

export const questionHeader= styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

export const questionTitle = styled.span`
  font-size: ${({theme}) => theme.typography.body.M};
  font-weight: ${({ theme }) => theme.typography.weight.semiBold}; 
  color: ${({ theme }) => theme.colors.text.black};
`

export const questionDate = styled.span`
  font-size: ${({theme}) => theme.typography.body.S};
  font-weight: ${({ theme }) => theme.typography.weight.medium}; 
  color: #CACACA;
`

export const status= styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`