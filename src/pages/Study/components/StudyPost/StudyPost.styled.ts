import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
  width: 100%;
  ${token.flexColumnCenter}
  gap: 10px;
`

export const Title = styled.span`
  ${token.typography("body","lg", "semibold")};
  color: ${token.colors.text.strong};
`

export const ContentContainer = styled.div`
  width: 100%;
  padding: 20px 30px;
  background-color: ${token.colors.main.white};
  border-radius: ${token.shapes.medium};
  border: 1px solid ${token.colors.line.normal};
  ${token.flexColumn}
  gap: 10px;
  box-sizing: border-box;
`


export const ContentTitle = styled.p`
  ${token.typography("body","md", "semibold")};
  ${token.colors.text.normal}
`

export const Content = styled.span`
  ${token.typography("caption","lg", "medium")};
  color: ${token.colors.text.neutral};
`

export const DetailButton = styled.button`
  width: 100%;
  height: 34px;
  background-color: ${token.colors.main.alternative};
  color: ${token.colors.main.white};
  border-radius: ${token.shapes.xsmall};
  ${token.typography("body","sm", "semibold")};
`