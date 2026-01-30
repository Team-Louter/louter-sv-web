import { createGlobalStyle } from 'styled-components';
import * as token from "@/styles/values/token";

export const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    font-family: ${token.fontFamily}, sans-serif;
    color: ${token.colors.text.black};
    background-color: ${token.colors.background.white};
    line-height: 1.5;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* 드래그 방지 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
  }

  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    /* 입력창은 드래그 가능해야 함 */
    -webkit-user-select: text;
    user-select: text;
  }
`;
