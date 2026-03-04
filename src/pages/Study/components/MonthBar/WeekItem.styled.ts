import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
  width: 25%;
  height: 100%;
  ${token.flexColumnCenter};
  justify-content: space-between;
  ${token.typography("body", "md", "semibold")};
  color: ${token.colors.text.neutral};
  padding: 40px 20px;
`

export const ContentContainer = styled.div`
  width: 100%;
  height: 50px;
  ${token.flexCenter}
`

export const DetailButton = styled.button`
  padding: 15px 18px;
  background-color: ${token.colors.main.alternative};
  color: ${token.colors.text.neutral};
  border-radius: ${token.shapes.medium};
  ${token.typography("body", "sm", "medium")};
`

export const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${token.colors.main.alternative};
  color: ${token.colors.text.neutral};
  font-size: 20px;
  ${token.flexCenter};
`

export const EmptyText = styled.span`
  ${token.typography("body", "sm", "medium")};
  color: ${token.colors.text.neutral};
  opacity: 0.3;
`