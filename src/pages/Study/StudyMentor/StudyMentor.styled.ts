import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  ${token.flexColumn}
  align-items: center;
  background-color: ${token.colors.background.lightGray};
  padding: 40px;
  box-sizing: border-box;
`

export const NavHeader = styled.div`
  width: 100%;
  ${token.flexRow}
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
`;

export const NavTitle = styled.h2`
  ${token.typography("heading", "md", "semibold")}
  color: ${token.colors.text.strong};
  min-width: 150px;
  text-align: center;
`;

export const NavButton = styled.button`
  width: 17px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  ${token.flexCenter}
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.5;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const PostGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
`;

export const EmptyState = styled.div`
  width: 100%;
  height: 300px;
  ${token.flexColumnCenter}
  ${token.typography("body", "md", "medium")}
  color: ${token.colors.text.neutral};
  opacity: 0.6;
`;