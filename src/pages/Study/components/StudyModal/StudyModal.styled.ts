import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
  width: 40%;
  height: 600px;
  background-color: ${token.colors.background.white};
  border: 1px solid ${token.colors.line.normal};
  border-radius: ${token.shapes.xlarge};
`