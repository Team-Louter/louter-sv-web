import styled from "styled-components";
import * as token from "@/styles/values/token";

export const container = styled.div`
  background-color: ${token.colors.background.lightGray};
  width: 100%;
  height: calc(100vh - 60px);
  ${token.flexColumnCenter};
  justify-content: flex-start;
  gap: 120px;
  overflow-y: scroll;
  padding: 60px 0;
`